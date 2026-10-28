import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  try {
    await repository.upsertSource({
      sourceId: 'SRC-PREF-LAI-001', organization: 'Prefeitura do Municipio de Itapevi',
      baseUrl: 'https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418', redistributionStatus: 'pending_review',
    });
    await repository.upsertDataset({
      datasetId: 'DS-LAI-COMPRAS-MODALIDADE-2026', sourceId: 'SRC-PREF-LAI-001',
      name: 'LAI - Compras por Tipo de Licitação - Resumo - 2026',
      scope: 'Exportacao de convidado em CSV; o piloto armazena somente totais e agrupamentos por modalidade. Processos e objetos permanecem no artefato local.',
      updateFrequency: 'sob_demanda', schemaVersion: 'lai-procurement-v1', status: 'candidate',
    });
    console.log('Catalogo de compras LAI registrado: SRC-PREF-LAI-001 / DS-LAI-COMPRAS-MODALIDADE-2026');
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao registrar catalogo de compras LAI:', error); process.exitCode = 1; });
