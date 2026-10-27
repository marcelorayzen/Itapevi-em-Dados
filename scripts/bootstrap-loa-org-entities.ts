import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

const LOA_SHA256 = 'D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  try {
    const artifactId = await repository.findArtifactIdBySha256(LOA_SHA256);
    if (!artifactId) throw new Error('Artefato LOA 2026 não encontrado. Registre-o antes de executar este script.');

    const governmentEntityId = await repository.upsertEntity({
      entityType: 'municipal_secretariat',
      canonicalName: 'Secretaria de Governo',
      confidence: 'high',
      resolutionStatus: 'accepted',
    });
    const governmentAliasId = await repository.recordEntityAlias({
      entityId: governmentEntityId,
      artifactId,
      aliasText: 'SECRETARIA DE GOVERNO',
      locator: { page: 51, section: 'orgao_orcamentario', verified_by: ['docling', 'pdf_text'] },
      confidence: 'high',
      resolutionStatus: 'accepted',
    });
    await repository.recordEntityResolutionDecision(
      governmentAliasId,
      'case_normalization',
      'A variação difere apenas por caixa; a forma canônica preserva a grafia legível sem ampliar o significado da entidade.',
      'system-rule:f2-case-normalization',
    );

    const ambiguousAliasId = await repository.recordEntityAlias({
      artifactId,
      aliasText: 'SECRETARIA DES. URBANO ORDENACAO DO SOLO',
      proposedCanonicalName: 'Secretaria de Desenvolvimento Urbano e Ordenação do Solo',
      locator: { page: 82, section: 'orgao_orcamentario', verified_by: ['docling'] },
      confidence: 'needs_review',
      resolutionStatus: 'needs_review',
    });
    await repository.recordEntityResolutionDecision(
      ambiguousAliasId,
      'deferred_ambiguous',
      'A expansão de “DES.” e a grafia canônica não foram comprovadas por uma segunda fonte oficial; nenhuma entidade foi criada ou fundida.',
      'system-rule:f2-ambiguity-guard',
    );

    console.log(JSON.stringify({ governmentEntityId, governmentAliasId, ambiguousAliasId }, null, 2));
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao registrar entidades da LOA:', error);
  process.exitCode = 1;
});
