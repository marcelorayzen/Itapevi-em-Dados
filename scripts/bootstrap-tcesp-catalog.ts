import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const repo = new ProvenanceRepository(pool);
    await repo.upsertSource({ sourceId: 'SRC-TCESP-001', organization: 'Tribunal de Contas do Estado de Sao Paulo', baseUrl: 'https://transparencia.tce.sp.gov.br/api/', redistributionStatus: 'pending_review' });
    await repo.upsertDataset({ datasetId: 'DS-TCESP-DESPESAS-2019-01', sourceId: 'SRC-TCESP-001', name: 'TCESP - Despesas de Itapevi - janeiro de 2019', scope: 'Piloto agregado; JSON bruto mantido somente localmente e nao exibido.', updateFrequency: 'historico', schemaVersion: 'tcesp-v1', status: 'candidate' });
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao registrar catalogo TCESP:', error); process.exitCode = 1; });
