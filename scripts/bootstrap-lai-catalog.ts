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
      datasetId: 'DS-LAI-PREVISTO-EMPENHADO-2026', sourceId: 'SRC-PREF-LAI-001',
      name: 'LAI - Previsto e Empenhado por Programa e Secretaria - 2026',
      scope: 'Exportacoes de convidado filtradas por periodo; totais refletem somente as linhas retornadas pelo painel.',
      updateFrequency: 'sob_demanda', schemaVersion: 'lai-v1', status: 'candidate',
    });
    console.log('Catalogo LAI registrado: SRC-PREF-LAI-001 / DS-LAI-PREVISTO-EMPENHADO-2026');
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error('Falha ao registrar catalogo LAI:', error); process.exitCode = 1; });
