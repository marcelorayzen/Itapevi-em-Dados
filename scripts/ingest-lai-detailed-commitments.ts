import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import unzipper from 'unzipper';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

const DATASET = 'DS-LAI-EMPENHOS-DETALHADOS';
const SOURCE = 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418';
const money = (value: string) => Number(value || 0);
const date = (value: string) => { const [day, month, year] = value.split('/'); return `${year}-${month}-${day}`; };
async function main() {
  const index = process.argv.indexOf('--input'); if (index < 0) throw new Error('Use --input <zip>.');
  const path = resolve(process.argv[index + 1]); const [bytes, info] = await Promise.all([readFile(path), stat(path)]);
  const zip = await unzipper.Open.file(path); const file = zip.files.find((entry) => entry.path.endsWith('.csv')); if (!file) throw new Error('ZIP sem CSV.');
  const text = new TextDecoder('windows-1252').decode(await file.buffer());
  const rows = parse(text, { columns: true, delimiter: '|', skip_empty_lines: true, relax_quotes: true, bom: true }) as Record<string, string>[];
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase(); const pool = createDatabasePool(); const repository = new ProvenanceRepository(pool);
  try {
    await repository.upsertSource({ sourceId: 'SRC-PREF-LAI-001', organization: 'Prefeitura do Municipio de Itapevi', baseUrl: SOURCE, redistributionStatus: 'allowed' });
    await repository.upsertDataset({ datasetId: DATASET, sourceId: 'SRC-PREF-LAI-001', name: 'LAI - Empenhado - Detalhe', scope: 'Empenhos detalhados exportados do portal municipal.', updateFrequency: 'sob_demanda', schemaVersion: 'lai-commitments-v1', status: 'active' });
    const artifactId = await repository.recordArtifact({ datasetId: DATASET, sourceUrl: SOURCE, collectedAt: info.birthtime, mediaType: 'application/zip', byteSize: info.size, sha256, storageRef: path, retentionStatus: 'retained_local', publicationStatus: 'approved_for_publication' });
    const client = await pool.connect();
    try { await client.query('BEGIN'); for (const row of rows) { const key = createHash('sha256').update(JSON.stringify(row)).digest('hex'); await client.query(`INSERT INTO detailed_commitment_records (commitment_record_id,artifact_id,record_key,commitment_number,process_number,committed_on,description,function_name,subfunction_name,application_name,budget_unit,program,action,original_amount,processed_amount,paid_amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT(record_key) DO UPDATE SET artifact_id=EXCLUDED.artifact_id`, [randomUUID(),artifactId,key,row['Nro Empenho'],row['Nro Processo']||null,date(row['Data Empenho']),row['Descrição Empenho'],row['Função']||null,row['Sub Função']||null,row['Aplicação']||null,row['Unidade Orçamentária'],row['Programa'],row['Ação'],money(row['Empenho Original']),money(row['Valor Processado']),money(row['Valor Pago'])]); } await client.query('COMMIT'); } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    console.log(JSON.stringify({ artifactId, records: rows.length, sha256 }));
  } finally { await pool.end(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
