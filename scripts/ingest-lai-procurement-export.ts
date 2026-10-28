import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { normalizeLaiProcurementCsv } from '../src/normalization/lai-procurement.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

const DATASET_ID = 'DS-LAI-COMPRAS-MODALIDADE-2026';
const SOURCE_URL = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';

function inputPath(): string {
  const index = process.argv.indexOf('--input');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error('Argumento obrigatorio ausente: --input');
  return resolve(value);
}

async function readExportCsv(path: string): Promise<string> {
  const archive = await unzipper.Open.file(path);
  const entry = archive.files.find((file) => !file.type.endsWith('Directory') && file.path.toLowerCase().endsWith('.csv'));
  if (!entry) throw new Error('ZIP nao contem arquivo CSV.');
  return new TextDecoder('windows-1252').decode(await entry.buffer());
}

async function main(): Promise<void> {
  const path = inputPath();
  const [zipBytes, fileStats, csvText] = await Promise.all([readFile(path), stat(path), readExportCsv(path)]);
  const normalized = normalizeLaiProcurementCsv(csvText);
  const sha256 = createHash('sha256').update(zipBytes).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;
  try {
    const artifactId = await repository.recordArtifact({ datasetId: DATASET_ID, sourceUrl: SOURCE_URL, collectedAt: fileStats.birthtime, mediaType: 'application/zip', byteSize: fileStats.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'blocked_pending_terms_review' });
    const run = { artifactId, processorName: 'lai-procurement-normalizer', processorVersion: 'lai-procurement-v1', configuration: { input: 'zip/csv', encoding: 'windows-1252', source_view: 'compras_por_tipo_licitacao_resumo', aggregation: 'modalidade' } };
    const previous = await repository.findSucceededProcessingRun(run);
    if (previous) { console.log(JSON.stringify({ artifactId, runId: previous, eventId: await repository.findEventIdByRunId(previous), reused: true }, null, 2)); return; }
    const started = await repository.startProcessingRun(run);
    runId = started.runId;
    if (!started.created) { console.log(JSON.stringify({ artifactId, runId, eventId: await repository.findEventIdByRunId(runId), reused: true }, null, 2)); return; }
    const evidenceId = await repository.recordEvidence({ artifactId, locator: { export_format: 'zip/csv', encoding: 'windows-1252', delimiter: '|', record_count: normalized.records, aggregation: 'modalidade' } });
    const eventId = await repository.recordEvent({ eventType: 'municipal_procurement_modalities_exported', status: 'candidate', runId, payload: normalized });
    await repository.linkEventEvidence(eventId, evidenceId);
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, recordCount: normalized.records, totals: normalized.totals, status: 'candidate' }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao ingerir exportacao de compras LAI:', error); process.exitCode = 1; });
