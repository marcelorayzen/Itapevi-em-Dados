import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

async function main(): Promise<void> {
  const pool = createDatabasePool(); const repository = new ProvenanceRepository(pool);
  try {
    await repository.upsertSource({ sourceId: 'SRC-PREF-LAI-CONTRACTS-001', organization: 'Prefeitura do Municipio de Itapevi', baseUrl: 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418', redistributionStatus: 'allowed' });
    await repository.upsertDataset({ datasetId: 'DS-LAI-CONTRACTS', sourceId: 'SRC-PREF-LAI-CONTRACTS-001', name: 'LAI - Contratos - Detalhe', scope: 'Contratos municipais por exercício; documentos de fornecedor mascarados no fato derivado.', updateFrequency: 'sob_demanda', schemaVersion: 'lai-contracts-v1', status: 'candidate' });
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
