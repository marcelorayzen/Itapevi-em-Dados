import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';
import { normalizeLaiContractsCsv } from '../src/normalization/lai-contracts.js';

const DATASET_ID = 'DS-LAI-CONTRACTS';
const SOURCE_URL = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';
function input(): string { const i = process.argv.indexOf('--input'); if (i < 0 || !process.argv[i + 1]) throw new Error('Argumento obrigatorio ausente: --input'); return resolve(process.argv[i + 1]); }
async function csv(path: string): Promise<string> { const z = await unzipper.Open.file(path); const f = z.files.find((x) => x.path.toLowerCase().endsWith('.csv')); if (!f) throw new Error('ZIP nao contem CSV.'); return new TextDecoder('windows-1252').decode(await f.buffer()); }
async function main(): Promise<void> {
  const path = input(); const [bytes, metadata, text] = await Promise.all([readFile(path), stat(path), csv(path)]); const contracts = normalizeLaiContractsCsv(text);
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase(); const pool = createDatabasePool(); const repository = new ProvenanceRepository(pool); let runId: string | undefined;
  try {
    const artifactId = await repository.recordArtifact({ datasetId: DATASET_ID, sourceUrl: SOURCE_URL, collectedAt: metadata.birthtime, mediaType: 'application/zip', byteSize: metadata.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'approved_for_publication' });
    const run = { artifactId, processorName: 'lai-contracts-normalizer', processorVersion: 'lai-contracts-v1', configuration: { input: 'zip/csv', encoding: 'windows-1252' } }; const previous = await repository.findSucceededProcessingRun(run); if (previous) { console.log(JSON.stringify({ artifactId, runId: previous, reused: true })); return; }
    const started = await repository.startProcessingRun(run); runId = started.runId; if (!started.created) { console.log(JSON.stringify({ artifactId, runId, reused: true })); return; }
    for (const c of contracts) { const key = createHash('sha256').update(JSON.stringify(c)).digest('hex'); await pool.query(`INSERT INTO contract_records (contract_id, artifact_id, record_key, exercise_year, contract_number, contract_type, supplier_document_masked, supplier_name, starts_on, ends_on, contracted_amount, committed_amount, processed_amount, paid_amount, object_description, procurement_process, managing_secretariat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (record_key) DO UPDATE SET artifact_id=EXCLUDED.artifact_id`, [randomUUID(), artifactId, key, c.year, c.number, c.type, c.supplierDocumentMasked, c.supplier, c.startsOn, c.endsOn, c.contractedAmount, c.committedAmount, c.processedAmount, c.paidAmount, c.object, c.procurementProcess || null, c.managingSecretariat]); }
    const evidenceId = await repository.recordEvidence({ artifactId, locator: { export_format: 'zip/csv', record_count: contracts.length, personal_documents: 'masked_in_derived_facts' } }); const eventId = await repository.recordEvent({ eventType: 'municipal_contracts_exported', status: 'candidate', runId, payload: { records: contracts.length, exercises: [...new Set(contracts.map((c) => c.year))] } }); await repository.linkEventEvidence(eventId, evidenceId); await repository.finishProcessingRun(runId, 'succeeded'); console.log(JSON.stringify({ artifactId, runId, eventId, records: contracts.length }));
  } catch (e) { if (runId) await repository.finishProcessingRun(runId, 'failed', e instanceof Error ? e.message : String(e)); throw e; } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao ingerir contratos:', error); process.exitCode = 1; });
