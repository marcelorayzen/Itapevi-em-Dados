import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const repository = new ProvenanceRepository(pool);
    await repository.upsertSource({ sourceId: 'SRC-IBGE-EST-2026-001', organization: 'IBGE', baseUrl: 'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/', redistributionStatus: 'pending_review' });
    await repository.upsertDataset({ datasetId: 'DS-IBGE-EST-2026', sourceId: 'SRC-IBGE-EST-2026-001', name: 'IBGE - Estimativas de populacao municipal 2026', scope: 'Estimativa de populacao residente municipal com referencia em 01/07/2026.', updateFrequency: 'anual', schemaVersion: 'ibge-est-v1', status: 'candidate' });
    console.log('Catalogo IBGE 2026 registrado');
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao registrar catalogo IBGE:', error); process.exitCode = 1; });
