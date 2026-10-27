import { createHash, randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

export type RedistributionStatus = 'pending_review' | 'allowed' | 'restricted' | 'prohibited';

export interface SourceRecord {
  sourceId: string;
  organization: string;
  baseUrl: string;
  termsUrl?: string;
  redistributionStatus: RedistributionStatus;
  reviewedAt?: Date;
}

export interface DatasetRecord {
  datasetId: string;
  sourceId: string;
  name: string;
  scope: string;
  updateFrequency?: string;
  schemaVersion: string;
  status: 'candidate' | 'active' | 'paused' | 'retired';
}

export interface ArtifactRecord {
  artifactId?: string;
  datasetId: string;
  sourceUrl: string;
  collectedAt: Date;
  mediaType: string;
  byteSize: number;
  sha256: string;
  storageRef: string;
  retentionStatus: 'retained_local' | 'retained_managed' | 'purged';
  publicationStatus: 'blocked_pending_terms_review' | 'internal_only' | 'approved_for_publication';
}

export interface ProcessingRunRecord {
  runId?: string;
  artifactId: string;
  processorName: string;
  processorVersion: string;
  configuration: Record<string, unknown>;
}

export interface ProcessingRunStartResult {
  runId: string;
  created: boolean;
}

export interface EvidenceRecord {
  evidenceId?: string;
  artifactId: string;
  locator: Record<string, unknown>;
  excerpt?: string;
}

export interface EventRecord {
  eventId?: string;
  eventType: string;
  occurredOn?: string;
  payload: Record<string, unknown>;
  status: 'candidate' | 'accepted' | 'nao_confirmado' | 'rejected';
  runId?: string;
}

export class ProvenanceRepository {
  constructor(private readonly pool: Pool) {}

  async upsertSource(source: SourceRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO sources (source_id, organization, base_url, terms_url, redistribution_status, reviewed_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (source_id) DO UPDATE SET
         organization = EXCLUDED.organization,
         base_url = EXCLUDED.base_url,
         terms_url = EXCLUDED.terms_url,
         redistribution_status = EXCLUDED.redistribution_status,
         reviewed_at = EXCLUDED.reviewed_at,
         updated_at = now()`,
      [source.sourceId, source.organization, source.baseUrl, source.termsUrl ?? null, source.redistributionStatus, source.reviewedAt ?? null],
    );
  }

  async upsertDataset(dataset: DatasetRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO datasets (dataset_id, source_id, name, scope, update_frequency, schema_version, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (dataset_id) DO UPDATE SET
         source_id = EXCLUDED.source_id,
         name = EXCLUDED.name,
         scope = EXCLUDED.scope,
         update_frequency = EXCLUDED.update_frequency,
         schema_version = EXCLUDED.schema_version,
         status = EXCLUDED.status,
         updated_at = now()`,
      [dataset.datasetId, dataset.sourceId, dataset.name, dataset.scope, dataset.updateFrequency ?? null, dataset.schemaVersion, dataset.status],
    );
  }

  async recordArtifact(artifact: ArtifactRecord): Promise<string> {
    if (!/^[A-Fa-f0-9]{64}$/.test(artifact.sha256)) {
      throw new Error('sha256 deve conter 64 caracteres hexadecimais.');
    }

    const artifactId = artifact.artifactId ?? randomUUID();
    const result = await this.pool.query<{ artifact_id: string }>(
      `INSERT INTO artifacts (
         artifact_id, dataset_id, source_url, collected_at, media_type, byte_size, sha256,
         storage_ref, retention_status, publication_status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (sha256) DO UPDATE SET sha256 = EXCLUDED.sha256
       RETURNING artifact_id`,
      [artifactId, artifact.datasetId, artifact.sourceUrl, artifact.collectedAt, artifact.mediaType, artifact.byteSize, artifact.sha256, artifact.storageRef, artifact.retentionStatus, artifact.publicationStatus],
    );
    return result.rows[0].artifact_id;
  }

  async startProcessingRun(run: ProcessingRunRecord): Promise<ProcessingRunStartResult> {
    const runId = run.runId ?? randomUUID();
    const deduplicationKey = createHash('sha256')
      .update(`${run.artifactId}:${run.processorName}:${run.processorVersion}:${JSON.stringify(run.configuration)}`)
      .digest('hex');
    const inserted = await this.pool.query<{ run_id: string }>(
      `INSERT INTO processing_runs (
         run_id, artifact_id, processor_name, processor_version, configuration, status, deduplication_key
       ) VALUES ($1, $2, $3, $4, $5, 'started', $6)
       ON CONFLICT (deduplication_key) DO NOTHING
       RETURNING run_id`,
      [runId, run.artifactId, run.processorName, run.processorVersion, run.configuration, deduplicationKey],
    );
    if (inserted.rows[0]) return { runId: inserted.rows[0].run_id, created: true };

    const existing = await this.pool.query<{ run_id: string }>(
      'SELECT run_id FROM processing_runs WHERE deduplication_key = $1',
      [deduplicationKey],
    );
    return { runId: existing.rows[0].run_id, created: false };
  }

  async findSucceededProcessingRun(run: Omit<ProcessingRunRecord, 'runId'>): Promise<string | undefined> {
    const result = await this.pool.query<{ run_id: string }>(
      `SELECT run_id FROM processing_runs
       WHERE artifact_id = $1
         AND processor_name = $2
         AND processor_version = $3
         AND configuration = $4::jsonb
         AND status = 'succeeded'
       ORDER BY started_at DESC
       LIMIT 1`,
      [run.artifactId, run.processorName, run.processorVersion, run.configuration],
    );
    return result.rows[0]?.run_id;
  }

  async findEventIdByRunId(runId: string): Promise<string | undefined> {
    const result = await this.pool.query<{ event_id: string }>(
      'SELECT event_id FROM events WHERE run_id = $1 ORDER BY created_at DESC LIMIT 1',
      [runId],
    );
    return result.rows[0]?.event_id;
  }

  async findArtifactIdBySha256(sha256: string): Promise<string | undefined> {
    const result = await this.pool.query<{ artifact_id: string }>(
      'SELECT artifact_id FROM artifacts WHERE sha256 = $1',
      [sha256],
    );
    return result.rows[0]?.artifact_id;
  }

  async recordEvidence(evidence: EvidenceRecord): Promise<string> {
    const evidenceId = evidence.evidenceId ?? randomUUID();
    await this.pool.query(
      `INSERT INTO evidence (evidence_id, artifact_id, locator, excerpt)
       VALUES ($1, $2, $3, $4)`,
      [evidenceId, evidence.artifactId, evidence.locator, evidence.excerpt ?? null],
    );
    return evidenceId;
  }

  async recordEvent(event: EventRecord): Promise<string> {
    const eventId = event.eventId ?? randomUUID();
    await this.pool.query(
      `INSERT INTO events (event_id, event_type, occurred_on, payload, status, run_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [eventId, event.eventType, event.occurredOn ?? null, event.payload, event.status, event.runId ?? null],
    );
    return eventId;
  }

  async linkEventEvidence(eventId: string, evidenceId: string, role = 'supports'): Promise<void> {
    await this.pool.query(
      `INSERT INTO event_evidence (event_id, evidence_id, role)
       VALUES ($1, $2, $3)`,
      [eventId, evidenceId, role],
    );
  }

  async finishProcessingRun(runId: string, status: 'succeeded' | 'failed' | 'partial', errorMessage?: string): Promise<void> {
    await this.pool.query(
      `UPDATE processing_runs
       SET status = $2, finished_at = now(), error_message = $3
       WHERE run_id = $1`,
      [runId, status, errorMessage ?? null],
    );
  }
}
