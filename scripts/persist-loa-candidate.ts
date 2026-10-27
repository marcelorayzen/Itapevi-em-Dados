import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

interface LoaCandidatePayload {
  lawDate: string;
  [key: string]: unknown;
}

function valueFor(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) throw new Error(`Argumento obrigatório ausente: ${name}`);
  return value;
}

async function main(): Promise<void> {
  const candidatePath = resolve(valueFor('--candidate'));
  const artifactSha256 = valueFor('--artifact-sha256');
  const candidate = JSON.parse(await readFile(candidatePath, 'utf8')) as LoaCandidatePayload;
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;

  try {
    const artifactId = await repository.findArtifactIdBySha256(artifactSha256);
    if (!artifactId) throw new Error(`Artefato não encontrado para SHA-256: ${artifactSha256}`);

    runId = await repository.startProcessingRun({
      artifactId,
      processorName: 'loa-normalizer',
      processorVersion: 'f1-loa-v1',
      configuration: {
        input: 'docling_markdown',
        manual_reference_pages: [1, 2],
        tables_included: false,
      },
    });

    const evidenceIds = await Promise.all([
      repository.recordEvidence({ artifactId, locator: { page: 1, section: 'lei_header', verified_by: ['docling', 'pdf_text'] } }),
      repository.recordEvidence({ artifactId, locator: { page: 1, section: 'artigo_1', verified_by: ['docling', 'pdf_text'] } }),
      repository.recordEvidence({ artifactId, locator: { page: 2, section: 'artigo_2', verified_by: ['docling', 'pdf_text'] } }),
    ]);
    const eventId = await repository.recordEvent({
      eventType: 'municipal_budget_law_declared',
      occurredOn: candidate.lawDate,
      payload: candidate,
      status: 'candidate',
      runId,
    });
    await Promise.all(evidenceIds.map((evidenceId) => repository.linkEventEvidence(eventId, evidenceId)));
    await repository.finishProcessingRun(runId, 'succeeded');

    console.log(JSON.stringify({ artifactId, runId, eventId, evidenceCount: evidenceIds.length, status: 'candidate' }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao persistir candidato da LOA:', error);
  process.exitCode = 1;
});
