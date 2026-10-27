import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';

type EntityEvidenceRow = {
  canonical_name: string | null;
  alias_text: string;
  resolution_status: string;
  confidence: string;
  source_organization: string;
  dataset_name: string;
  artifact_sha256: string;
  locator: Record<string, unknown>;
};

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const result = await pool.query<EntityEvidenceRow>(`
      SELECT
        e.canonical_name,
        ea.alias_text,
        ea.resolution_status,
        ea.confidence,
        s.organization AS source_organization,
        d.name AS dataset_name,
        a.sha256 AS artifact_sha256,
        ea.locator
      FROM entity_aliases ea
      JOIN artifacts a ON a.artifact_id = ea.artifact_id
      JOIN datasets d ON d.dataset_id = a.dataset_id
      JOIN sources s ON s.source_id = d.source_id
      LEFT JOIN entities e ON e.entity_id = ea.entity_id
      ORDER BY ea.created_at;
    `);
    console.log(JSON.stringify({ records: result.rows }, null, 2));
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao inspecionar evidencias de entidades:', error);
  process.exitCode = 1;
});
