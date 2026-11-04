import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { normalizeLaiBudgetCsv, normalizeLaiBudgetJson } from '../src/normalization/lai-budget.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

const DATASET_ID = 'DS-LAI-PREVISTO-EMPENHADO-2026';
const SOURCE_URL = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';

function inputPath(): string {
  const index = process.argv.indexOf('--input');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error('Argumento obrigatorio ausente: --input');
  return resolve(value);
}

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function readExport(path: string): Promise<{ format: 'json' | 'csv'; text: string }> {
  const archive = await unzipper.Open.file(path);
  const entry = archive.files.find((file) => !file.type.endsWith('Directory') && /\.(json|csv)$/i.test(file.path));
  if (!entry) throw new Error('ZIP nao contem arquivo JSON ou CSV.');
  const buffer = await entry.buffer();
  return { format: entry.path.toLowerCase().endsWith('.csv') ? 'csv' : 'json', text: new TextDecoder('windows-1252').decode(buffer) };
}

async function main(): Promise<void> {
  const path = inputPath();
  const [zipBytes, fileStats, exported] = await Promise.all([readFile(path), stat(path), readExport(path)]);
  const periodStart = argument('--period-start');
  const periodEnd = argument('--period-end');
  const temporalFilter = argument('--temporal-filter') ?? 'Data de Empenho';
  const normalized = exported.format === 'json'
    ? normalizeLaiBudgetJson(exported.text)
    : normalizeLaiBudgetCsv(exported.text, {
      periodStart: periodStart ?? '', periodEnd: periodEnd ?? '', temporalFilter,
      exportedAt: fileStats.birthtime.toISOString(),
    });
  const sha256 = createHash('sha256').update(zipBytes).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;
  try {
    const artifactId = await repository.recordArtifact({
      datasetId: DATASET_ID, sourceUrl: SOURCE_URL, collectedAt: fileStats.birthtime,
      mediaType: 'application/zip', byteSize: fileStats.size, sha256, storageRef: path,
      retentionStatus: 'retained_local', publicationStatus: 'blocked_pending_terms_review',
    });
    const run = {
      artifactId, processorName: 'lai-budget-normalizer', processorVersion: 'lai-v3',
      configuration: { input: `zip_${exported.format}`, encoding: 'windows-1252', source_view: 'previsto_empenhado_por_programa_secretaria', period: normalized.period },
    };
    const previous = await repository.findSucceededProcessingRun(run);
    if (previous) {
      console.log(JSON.stringify({ artifactId, runId: previous, eventId: await repository.findEventIdByRunId(previous), reused: true }, null, 2));
      return;
    }
    const started = await repository.startProcessingRun(run);
    runId = started.runId;
    if (!started.created) {
      console.log(JSON.stringify({ artifactId, runId, eventId: await repository.findEventIdByRunId(runId), reused: true }, null, 2));
      return;
    }
    for (const record of normalized.records) {
      const recordKey = createHash('sha256').update(JSON.stringify(record)).digest('hex');
      await pool.query(
        `INSERT INTO budget_execution_records (budget_execution_id, artifact_id, record_key, period_start, period_end, temporal_filter, program, action, responsible_body, planned_amount, realized_amount)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (artifact_id, record_key) DO UPDATE SET
           period_start = EXCLUDED.period_start, period_end = EXCLUDED.period_end, temporal_filter = EXCLUDED.temporal_filter`,
        [randomUUID(), artifactId, recordKey, normalized.period.start, normalized.period.end, normalized.period.temporalFilter, record.program, record.action, record.responsibleBody, record.plannedAmount, record.realizedAmount],
      );
    }
    const evidenceId = await repository.recordEvidence({ artifactId, locator: { export_format: `zip/${exported.format}`, filters: normalized.filters, period: normalized.period, record_count: normalized.records.length, encoding: 'windows-1252' } });
    const eventId = await repository.recordEvent({
      eventType: 'municipal_budget_panel_exported', status: 'candidate', runId,
      payload: {
        origin: normalized.origin, exportedAt: normalized.exportedAt, filters: normalized.filters, period: normalized.period,
        recordCount: normalized.records.length, totals: normalized.totals,
        breakdown: normalized.records.map((record) => ({ program: record.program, responsibleBody: record.responsibleBody, plannedAmount: record.plannedAmount, realizedAmount: record.realizedAmount })),
      },
    });
    await repository.linkEventEvidence(eventId, evidenceId);
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, period: normalized.period, recordCount: normalized.records.length, totals: normalized.totals, status: 'candidate' }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao ingerir exportacao LAI:', error); process.exitCode = 1; });
