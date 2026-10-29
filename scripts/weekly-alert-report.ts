import 'dotenv/config';
import { createWeeklyAlertReport, type WeeklyAlertSnapshot } from '../src/alerts/weekly-report.js';
import { createDatabasePool } from '../src/db/connection.js';

const DAYS = 7;

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const [artifacts, failures, terms, entities] = await Promise.all([
      pool.query<{ dataset_id: string; dataset_name: string; source_id: string; source_url: string; sha256: string; collected_at: Date }>(`
        SELECT d.dataset_id, d.name AS dataset_name, s.source_id, a.source_url, a.sha256, a.collected_at
        FROM artifacts a JOIN datasets d ON d.dataset_id = a.dataset_id JOIN sources s ON s.source_id = d.source_id
        WHERE a.collected_at >= now() - ($1::text || ' days')::interval ORDER BY a.collected_at DESC`, [DAYS]),
      pool.query<{ run_id: string; dataset_id: string; source_id: string; source_url: string; sha256: string; processor_name: string; finished_at: Date }>(`
        SELECT pr.run_id, d.dataset_id, s.source_id, a.source_url, a.sha256, pr.processor_name, pr.finished_at
        FROM processing_runs pr JOIN artifacts a ON a.artifact_id = pr.artifact_id JOIN datasets d ON d.dataset_id = a.dataset_id JOIN sources s ON s.source_id = d.source_id
        WHERE pr.status = 'failed' AND pr.processor_name <> 'f1-lifecycle-verification'
          AND pr.finished_at >= now() - ($1::text || ' days')::interval ORDER BY pr.finished_at DESC`, [DAYS]),
      pool.query<{ source_id: string; dataset_id: string; organization: string; source_url: string }>(`
        SELECT DISTINCT ON (s.source_id) s.source_id, d.dataset_id, s.organization, s.base_url AS source_url
        FROM sources s JOIN datasets d ON d.source_id = s.source_id
        WHERE s.redistribution_status = 'pending_review' ORDER BY s.source_id, d.dataset_id`),
      pool.query<{ dataset_id: string; source_id: string; source_url: string; sha256: string; count: string }>(`
        SELECT d.dataset_id, s.source_id, a.source_url, a.sha256, count(*) AS count
        FROM entity_aliases ea JOIN artifacts a ON a.artifact_id = ea.artifact_id JOIN datasets d ON d.dataset_id = a.dataset_id JOIN sources s ON s.source_id = d.source_id
        WHERE ea.resolution_status = 'needs_review'
        GROUP BY d.dataset_id, s.source_id, a.source_url, a.sha256 ORDER BY d.dataset_id`),
    ]);
    const snapshot: WeeklyAlertSnapshot = {
      newArtifacts: artifacts.rows.map((row) => ({ datasetId: row.dataset_id, datasetName: row.dataset_name, sourceId: row.source_id, sourceUrl: row.source_url, sha256: row.sha256, collectedAt: row.collected_at.toISOString() })),
      failedRuns: failures.rows.map((row) => ({ runId: row.run_id, datasetId: row.dataset_id, sourceId: row.source_id, sourceUrl: row.source_url, sha256: row.sha256, processorName: row.processor_name, finishedAt: row.finished_at.toISOString() })),
      pendingTerms: terms.rows.map((row) => ({ sourceId: row.source_id, datasetId: row.dataset_id, organization: row.organization, sourceUrl: row.source_url })),
      pendingEntities: entities.rows.map((row) => ({ datasetId: row.dataset_id, sourceId: row.source_id, sourceUrl: row.source_url, sha256: row.sha256, count: Number(row.count) })),
    };
    console.log(JSON.stringify(createWeeklyAlertReport(snapshot), null, 2));
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao gerar relatorio semanal de alertas:', error); process.exitCode = 1; });
