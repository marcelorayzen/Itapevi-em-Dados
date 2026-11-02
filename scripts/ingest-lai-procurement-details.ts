import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';
import { normalizeLaiProcurementDetailsCsv } from '../src/normalization/lai-procurement-details.js';

const DATASET_ID = 'DS-LAI-COMPRAS-MODALIDADE-2026';
const SOURCE_URL = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';

function input(): string {
  const index = process.argv.indexOf('--input');
  if (index < 0 || !process.argv[index + 1]) {
    throw new Error('Argumento obrigatorio ausente: --input');
  }
  return resolve(process.argv[index + 1]);
}

async function readCsv(path: string): Promise<string> {
  const zip = await unzipper.Open.file(path);
  const csv = zip.files.find((file) => file.path.toLowerCase().endsWith('.csv'));
  if (!csv) throw new Error('ZIP nao contem CSV.');
  return new TextDecoder('windows-1252').decode(await csv.buffer());
}

async function main(): Promise<void> {
  const path = input();
  const [bytes, metadata, text] = await Promise.all([readFile(path), stat(path), readCsv(path)]);
  const procurements = normalizeLaiProcurementDetailsCsv(text);
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;

  try {
    const artifactId = await repository.recordArtifact({
      datasetId: DATASET_ID,
      sourceUrl: SOURCE_URL,
      collectedAt: metadata.birthtime,
      mediaType: 'application/zip',
      byteSize: metadata.size,
      sha256,
      storageRef: path,
      retentionStatus: 'retained_local',
      publicationStatus: 'approved_for_publication',
    });
    const run = {
      artifactId,
      processorName: 'lai-procurement-details-normalizer',
      processorVersion: 'lai-procurement-details-v1',
      configuration: { input: 'zip/csv', encoding: 'windows-1252' },
    };
    const previous = await repository.findSucceededProcessingRun(run);
    if (previous) {
      console.log(JSON.stringify({ artifactId, runId: previous, reused: true }));
      return;
    }

    const started = await repository.startProcessingRun(run);
    runId = started.runId;
    if (!started.created) {
      console.log(JSON.stringify({ artifactId, runId, reused: true }));
      return;
    }

    for (const procurement of procurements) {
      const recordKey = createHash('sha256').update(JSON.stringify(procurement)).digest('hex');
      await pool.query(
        `INSERT INTO procurement_records (
          procurement_id, artifact_id, record_key, exercise_year, modality,
          procurement_process, administrative_process, object_description, status,
          published_on, opening_on, price_registration_total, purchased_amount,
          estimated_amount, item_count
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) ON CONFLICT (record_key) DO UPDATE SET artifact_id = EXCLUDED.artifact_id`,
        [
          randomUUID(), artifactId, recordKey, procurement.exerciseYear, procurement.modality,
          procurement.procurementProcess, procurement.administrativeProcess,
          procurement.objectDescription, procurement.status, procurement.publishedOn,
          procurement.openingOn, procurement.priceRegistrationTotal, procurement.purchasedAmount,
          procurement.estimatedAmount, procurement.itemCount,
        ],
      );
    }

    const evidenceId = await repository.recordEvidence({
      artifactId,
      locator: { export_format: 'zip/csv', record_count: procurements.length },
    });
    const eventId = await repository.recordEvent({
      eventType: 'municipal_procurements_exported',
      status: 'candidate',
      runId,
      payload: {
        records: procurements.length,
        exercises: [...new Set(procurements.map((item) => item.exerciseYear))],
      },
    });
    await repository.linkEventEvidence(eventId, evidenceId);
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, records: procurements.length }));
  } catch (error) {
    if (runId) {
      await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    }
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao ingerir licitacoes:', error);
  process.exitCode = 1;
});
