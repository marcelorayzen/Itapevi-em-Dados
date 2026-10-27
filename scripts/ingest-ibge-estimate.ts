import 'dotenv/config';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

const execute = promisify(execFile);
const input = () => { const i = process.argv.indexOf('--input'); if (i < 0 || !process.argv[i + 1]) throw new Error('Argumento obrigatorio ausente: --input'); return resolve(process.argv[i + 1]); };

async function main(): Promise<void> {
  const path = input();
  const [bytes, fileStats] = await Promise.all([readFile(path), stat(path)]);
  const { stdout } = await execute(process.env.PYTHON_BIN ?? 'python', ['scripts/extract-ibge-estimate.py', '--input', path]);
  const candidate = JSON.parse(stdout) as Record<string, unknown>;
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase();
  const pool = createDatabasePool(); const repository = new ProvenanceRepository(pool); let runId: string | undefined;
  try {
    const artifactId = await repository.recordArtifact({ datasetId: 'DS-IBGE-EST-2026', sourceUrl: 'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/estimativa_dou_2026.xlsx', collectedAt: fileStats.birthtime, mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', byteSize: fileStats.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'blocked_pending_terms_review' });
    const run = { artifactId, processorName: 'ibge-estimate-extractor', processorVersion: 'ibge-est-v1', configuration: { municipality: 'Itapevi', worksheet_index: 1, extractor: 'openpyxl-3.1.5' } };
    const prior = await repository.findSucceededProcessingRun(run); if (prior) { console.log(JSON.stringify({ artifactId, runId: prior, reused: true }, null, 2)); return; }
    const started = await repository.startProcessingRun(run); runId = started.runId; if (!started.created) { console.log(JSON.stringify({ artifactId, runId, reused: true }, null, 2)); return; }
    const evidenceId = await repository.recordEvidence({ artifactId, locator: { worksheet_index: 1, municipality: 'Itapevi', municipality_code: '3522505' } });
    const eventId = await repository.recordEvent({ eventType: 'municipal_population_estimated', occurredOn: '2026-07-01', payload: candidate, status: 'candidate', runId });
    await repository.linkEventEvidence(eventId, evidenceId); await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, candidate, status: 'candidate' }, null, 2));
  } catch (error) { if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error)); throw error; } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao ingerir estimativa IBGE:', error); process.exitCode = 1; });
