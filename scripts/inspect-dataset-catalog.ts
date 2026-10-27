import 'dotenv/config';
import { createDatasetCatalogResponse, type DatasetCatalogRow } from '../src/catalog/dataset-catalog.js';
import { createDatabasePool } from '../src/db/connection.js';

type DatabaseRow = {
  source_id: string;
  organization: string;
  base_url: string;
  terms_url: string | null;
  redistribution_status: DatasetCatalogRow['redistributionStatus'];
  reviewed_at: Date | null;
  dataset_id: string;
  name: string;
  scope: string;
  update_frequency: string | null;
  schema_version: string;
  status: DatasetCatalogRow['status'];
  artifact_count: string;
  latest_collection: Date | null;
};

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const result = await pool.query<DatabaseRow>(`
      SELECT s.source_id, s.organization, s.base_url, s.terms_url, s.redistribution_status, s.reviewed_at,
             d.dataset_id, d.name, d.scope, d.update_frequency, d.schema_version, d.status,
             count(a.artifact_id) AS artifact_count, max(a.collected_at) AS latest_collection
      FROM sources s
      JOIN datasets d ON d.source_id = s.source_id
      LEFT JOIN artifacts a ON a.dataset_id = d.dataset_id
      GROUP BY s.source_id, s.organization, s.base_url, s.terms_url, s.redistribution_status, s.reviewed_at,
               d.dataset_id, d.name, d.scope, d.update_frequency, d.schema_version, d.status
      ORDER BY d.dataset_id;
    `);
    const rows: DatasetCatalogRow[] = result.rows.map((row) => ({
      sourceId: row.source_id,
      organization: row.organization,
      baseUrl: row.base_url,
      termsUrl: row.terms_url,
      redistributionStatus: row.redistribution_status,
      reviewedAt: row.reviewed_at?.toISOString() ?? null,
      datasetId: row.dataset_id,
      name: row.name,
      scope: row.scope,
      updateFrequency: row.update_frequency,
      schemaVersion: row.schema_version,
      status: row.status,
      artifactCount: Number(row.artifact_count),
      latestCollection: row.latest_collection?.toISOString() ?? null,
    }));
    console.log(JSON.stringify(createDatasetCatalogResponse(rows), null, 2));
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao inspecionar catalogo de datasets:', error);
  process.exitCode = 1;
});
