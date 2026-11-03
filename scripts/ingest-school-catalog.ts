import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';
import { normalizeSchoolCatalogHtml } from '../src/normalization/school-catalog.js';

const SOURCE_URL = 'https://itapevi.sp.gov.br/escolas/';
const SOURCE_ID = 'SRC-PREF-EDUCATION-001';
const DATASET_ID = 'DS-PREF-SCHOOL-CATALOG';

function inputPath(): string {
  const index = process.argv.indexOf('--input');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error('Argumento obrigatório ausente: --input <html>.');
  return resolve(value);
}

async function main(): Promise<void> {
  const path = inputPath();
  const [content, metadata] = await Promise.all([readFile(path), stat(path)]);
  const schools = normalizeSchoolCatalogHtml(content.toString('utf8'));
  const sha256 = createHash('sha256').update(content).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;
  try {
    await repository.upsertSource({ sourceId: SOURCE_ID, organization: 'Prefeitura do Município de Itapevi', baseUrl: SOURCE_URL, redistributionStatus: 'allowed', reviewedAt: new Date('2026-11-02T00:00:00-03:00') });
    await repository.upsertDataset({ datasetId: DATASET_ID, sourceId: SOURCE_ID, name: 'Catálogo de unidades escolares municipais', scope: 'Nome, endereço e contato conforme página oficial; não inclui matrícula, capacidade, desempenho ou situação de obra.', updateFrequency: 'sob_demanda', schemaVersion: 'school-catalog-v1', status: 'active' });
    const artifactId = await repository.recordArtifact({ datasetId: DATASET_ID, sourceUrl: SOURCE_URL, collectedAt: metadata.birthtime, mediaType: 'text/html', byteSize: metadata.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'approved_for_publication' });
    const run = { artifactId, processorName: 'school-catalog-normalizer', processorVersion: 'school-catalog-v1', configuration: { source_format: 'html', selector: 'h2,h3,h4,strong', acceptance: 'named_school_or_partner' } };
    const previous = await repository.findSucceededProcessingRun(run);
    if (previous) { console.log(JSON.stringify({ artifactId, runId: previous, reused: true }, null, 2)); return; }
    const started = await repository.startProcessingRun(run); runId = started.runId;
    if (!started.created) { console.log(JSON.stringify({ artifactId, runId, reused: true }, null, 2)); return; }
    for (const school of schools) {
      const recordKey = createHash('sha256').update(JSON.stringify(school)).digest('hex');
      await pool.query(
        `INSERT INTO school_catalog_records (school_record_id, artifact_id, record_key, name, address, phone, source_position)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (record_key) DO UPDATE SET artifact_id = EXCLUDED.artifact_id`,
        [randomUUID(), artifactId, recordKey, school.name, school.address, school.phone, school.sourcePosition],
      );
    }
    const evidenceId = await repository.recordEvidence({ artifactId, locator: { source_url: SOURCE_URL, record_count: schools.length, fields: ['name', 'address', 'phone'] } });
    const eventId = await repository.recordEvent({ eventType: 'municipal_school_catalog_collected', status: 'candidate', runId, payload: { records: schools.length } });
    await repository.linkEventEvidence(eventId, evidenceId);
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, records: schools.length, sha256 }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally { await pool.end(); }
}

main().catch((error: unknown) => { console.error('Falha ao ingerir catálogo de escolas:', error); process.exitCode = 1; });
