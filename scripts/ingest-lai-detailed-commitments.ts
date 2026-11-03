import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';
import { normalizeLaiDetailedCommitmentsCsv } from '../src/normalization/lai-detailed-commitments.js';

const DATASET_ID = 'DS-LAI-EMPENHOS-DETALHADOS';
const SOURCE_URL = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';
const BATCH_SIZE = 400;

function inputPath(): string {
  const index = process.argv.indexOf('--input');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error('Argumento obrigatorio ausente: --input');
  return resolve(value);
}

function repairArtifactId(): string | undefined {
  const index = process.argv.indexOf('--repair-artifact-id');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (index >= 0 && !value) throw new Error('Argumento obrigatorio ausente: --repair-artifact-id <uuid>');
  return value;
}

async function readExportCsv(path: string): Promise<string> {
  const archive = await unzipper.Open.file(path);
  const entry = archive.files.find((file) => !file.type.endsWith('Directory') && file.path.toLowerCase().endsWith('.csv'));
  if (!entry) throw new Error('ZIP nao contem arquivo CSV.');
  return new TextDecoder('windows-1252').decode(await entry.buffer());
}

async function main(): Promise<void> {
  const path = inputPath();
  const previousArtifactId = repairArtifactId();
  const [zipBytes, fileStats, csvText] = await Promise.all([readFile(path), stat(path), readExportCsv(path)]);
  const commitments = normalizeLaiDetailedCommitmentsCsv(csvText);
  const sha256 = createHash('sha256').update(zipBytes).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;

  try {
    await repository.upsertSource({ sourceId: 'SRC-PREF-LAI-001', organization: 'Prefeitura do Municipio de Itapevi', baseUrl: SOURCE_URL, redistributionStatus: 'allowed' });
    await repository.upsertDataset({ datasetId: DATASET_ID, sourceId: 'SRC-PREF-LAI-001', name: 'LAI - Empenhado - Detalhe', scope: 'Empenhos detalhados exportados do portal municipal.', updateFrequency: 'sob_demanda', schemaVersion: 'lai-commitments-v1', status: 'active' });
    const artifactId = await repository.recordArtifact({ datasetId: DATASET_ID, sourceUrl: SOURCE_URL, collectedAt: fileStats.birthtime, mediaType: 'application/zip', byteSize: fileStats.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'approved_for_publication' });
    const run = { artifactId, processorName: 'lai-detailed-commitments-normalizer', processorVersion: 'lai-detailed-commitments-v2', configuration: { input: 'zip/csv', encoding: 'windows-1252', delimiter: '|', batch_size: BATCH_SIZE } };
    const previous = await repository.findSucceededProcessingRun(run);
    if (previous) { console.log(JSON.stringify({ artifactId, runId: previous, eventId: await repository.findEventIdByRunId(previous), reused: true }, null, 2)); return; }
    const started = await repository.startProcessingRun(run);
    runId = started.runId;
    if (!started.created) { console.log(JSON.stringify({ artifactId, runId, eventId: await repository.findEventIdByRunId(runId), reused: true }, null, 2)); return; }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      if (previousArtifactId) {
        const repaired = await client.query('UPDATE detailed_commitment_records SET artifact_id = $1 WHERE artifact_id = $2', [artifactId, previousArtifactId]);
        if (repaired.rowCount !== commitments.length) throw new Error(`Reparo de proveniencia recusado: esperados ${commitments.length} registros e atualizados ${repaired.rowCount}.`);
      } else for (let offset = 0; offset < commitments.length; offset += BATCH_SIZE) {
        const batch = commitments.slice(offset, offset + BATCH_SIZE);
        const recordKeys = batch.map((row) => createHash('sha256').update(JSON.stringify(row)).digest('hex'));
        await client.query(
          `INSERT INTO detailed_commitment_records (
             commitment_record_id, artifact_id, record_key, commitment_number, process_number, committed_on, description,
             function_name, subfunction_name, application_name, budget_unit, program, action, original_amount, processed_amount, paid_amount
           )
           SELECT * FROM UNNEST(
             $1::uuid[], $2::uuid[], $3::text[], $4::text[], $5::text[], $6::date[], $7::text[],
             $8::text[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::numeric[], $15::numeric[], $16::numeric[]
           )
           ON CONFLICT (record_key) DO UPDATE SET artifact_id = EXCLUDED.artifact_id`,
          [
            batch.map(() => randomUUID()), batch.map(() => artifactId), recordKeys, batch.map((row) => row.commitmentNumber), batch.map((row) => row.processNumber), batch.map((row) => row.committedOn), batch.map((row) => row.description),
            batch.map((row) => row.functionName), batch.map((row) => row.subfunctionName), batch.map((row) => row.applicationName), batch.map((row) => row.budgetUnit), batch.map((row) => row.program), batch.map((row) => row.action), batch.map((row) => row.originalAmount), batch.map((row) => row.processedAmount), batch.map((row) => row.paidAmount),
          ],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }

    const evidenceId = await repository.recordEvidence({ artifactId, locator: { export_format: 'zip/csv', encoding: 'windows-1252', delimiter: '|', malformed_quotes: 'treated_as_literal', record_count: commitments.length } });
    const dates = commitments.map((row) => row.committedOn).sort();
    const eventId = await repository.recordEvent({ eventType: 'municipal_detailed_commitments_exported', status: 'candidate', runId, payload: { records: commitments.length, committed_on_min: dates[0], committed_on_max: dates.at(-1) } });
    await repository.linkEventEvidence(eventId, evidenceId);
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, records: commitments.length, sha256, provenanceRepaired: Boolean(previousArtifactId) }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally { await pool.end(); }
}

main().catch((error: unknown) => { console.error('Falha ao ingerir empenhos detalhados LAI:', error); process.exitCode = 1; });
