import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

type Expense = { orgao: string; evento: string; vl_despesa: string };
const input = () => { const i = process.argv.indexOf('--input'); if (i < 0 || !process.argv[i + 1]) throw new Error('Argumento obrigatorio ausente: --input'); return resolve(process.argv[i + 1]); };
const money = (value: string) => Number(value.replaceAll('.', '').replace(',', '.'));
async function main(): Promise<void> {
  const path = input(); const [bytes, info] = await Promise.all([readFile(path), stat(path)]);
  const rows = JSON.parse(bytes.toString('utf8')) as Expense[];
  const totals = new Map<string, number>();
  for (const row of rows) { const key = `${row.orgao}|${row.evento}`; totals.set(key, (totals.get(key) ?? 0) + money(row.vl_despesa)); }
  const aggregate = [...totals.entries()].map(([key, value]) => { const [orgao, evento] = key.split('|'); return { orgao, evento, total: Math.round(value * 100) / 100 }; });
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase(); const pool = createDatabasePool(); const repo = new ProvenanceRepository(pool); let runId: string | undefined;
  try {
    const artifactId = await repo.recordArtifact({ datasetId: 'DS-TCESP-DESPESAS-2019-01', sourceUrl: 'https://transparencia.tce.sp.gov.br/api/json/despesas/itapevi/2019/1', collectedAt: info.birthtime, mediaType: 'application/json', byteSize: info.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'blocked_pending_terms_review' });
    const run = { artifactId, processorName: 'tcesp-expense-aggregator', processorVersion: 'tcesp-v1', configuration: { municipality: 'itapevi', year: 2019, month: 1, personal_data: 'not_persisted_in_event' } };
    const prior = await repo.findSucceededProcessingRun(run); if (prior) { console.log(JSON.stringify({ artifactId, runId: prior, reused: true })); return; }
    const started = await repo.startProcessingRun(run); runId = started.runId; if (!started.created) { console.log(JSON.stringify({ artifactId, runId, reused: true })); return; }
    const evidenceId = await repo.recordEvidence({ artifactId, locator: { endpoint: 'despesas/itapevi/2019/1', aggregation: 'orgao_evento', raw_retention: 'local_only' } });
    const eventId = await repo.recordEvent({ eventType: 'municipal_expense_month_aggregated', occurredOn: '2019-01-31', status: 'candidate', runId, payload: { municipality: 'Itapevi', period: '2019-01', recordCount: rows.length, aggregate } });
    await repo.linkEventEvidence(eventId, evidenceId); await repo.finishProcessingRun(runId, 'succeeded'); console.log(JSON.stringify({ artifactId, runId, eventId, recordCount: rows.length, groups: aggregate.length, status: 'candidate' }));
  } catch (error) { if (runId) await repo.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error)); throw error; } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao agregar TCESP:', error); process.exitCode = 1; });
