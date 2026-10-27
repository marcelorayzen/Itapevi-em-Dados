import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  try {
    await repository.upsertSource({
      sourceId: 'SRC-LOA-2026-001',
      organization: 'Prefeitura do Município de Itapevi',
      baseUrl: 'https://itapevi.sp.gov.br/',
      redistributionStatus: 'pending_review',
    });
    await repository.upsertDataset({
      datasetId: 'DS-LOA-2026',
      sourceId: 'SRC-LOA-2026-001',
      name: 'Lei Orçamentária Anual de Itapevi — exercício 2026',
      scope: 'Documento oficial de orçamento aprovado; não comprova emendas individualizadas ou execução financeira.',
      updateFrequency: 'anual',
      schemaVersion: 'f1-v1',
      status: 'candidate',
    });
    console.log('Catálogo F1 registrado: SRC-LOA-2026-001 / DS-LOA-2026');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao registrar catálogo F1:', error);
  process.exitCode = 1;
});
