import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

function valueFor(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) {
    throw new Error(`Argumento obrigatório ausente: ${name}`);
  }
  return value;
}

async function main(): Promise<void> {
  const inputPath = resolve(valueFor('--input'));
  const sourceUrl = valueFor('--source-url');
  const datasetId = valueFor('--dataset-id');
  const storageRef = valueFor('--storage-ref');
  const mediaType = valueFor('--media-type');
  const publicationStatus = valueFor('--publication-status') as 'blocked_pending_terms_review' | 'internal_only' | 'approved_for_publication';

  const [content, fileStats] = await Promise.all([readFile(inputPath), stat(inputPath)]);
  const sha256 = createHash('sha256').update(content).digest('hex').toUpperCase();

  const pool = createDatabasePool();
  try {
    const artifactId = await new ProvenanceRepository(pool).recordArtifact({
      datasetId,
      sourceUrl,
      collectedAt: fileStats.birthtime,
      mediaType,
      byteSize: fileStats.size,
      sha256,
      storageRef,
      retentionStatus: 'retained_local',
      publicationStatus,
    });
    console.log(JSON.stringify({ artifactId, sha256, byteSize: fileStats.size }, null, 2));
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao registrar artefato:', error);
  process.exitCode = 1;
});
