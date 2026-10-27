import { createDatasetCatalogResponse, type DatasetCatalogRow } from '../catalog/dataset-catalog.js';
import { createCommonResponse, type CommonResponse } from '../contracts/response.js';
import { createDatabasePool } from '../db/connection.js';

export interface EntityEvidenceItem {
  canonicalName: string | null;
  aliasText: string;
  resolutionStatus: string;
  confidence: string;
  sourceOrganization: string;
  datasetName: string;
  artifactSha256: string;
  locator: Record<string, unknown>;
}

export interface DemoDataProvider {
  getCatalog(): Promise<CommonResponse<{ datasets: unknown[] }>>;
  getEntities(): Promise<CommonResponse<{ entities: EntityEvidenceItem[] }>>;
  getBudgetSummary(): Promise<CommonResponse<{ exports: unknown[] }>>;
}

type CatalogDatabaseRow = {
  source_id: string; organization: string; base_url: string; terms_url: string | null;
  redistribution_status: DatasetCatalogRow['redistributionStatus']; reviewed_at: Date | null;
  dataset_id: string; name: string; scope: string; update_frequency: string | null;
  schema_version: string; status: DatasetCatalogRow['status']; artifact_count: string; latest_collection: Date | null;
};

type EntityDatabaseRow = {
  canonical_name: string | null; alias_text: string; resolution_status: string; confidence: string;
  source_id: string; dataset_id: string; source_organization: string; dataset_name: string; artifact_sha256: string; locator: Record<string, unknown>;
};

export function createPostgresDemoDataProvider(): DemoDataProvider {
  return {
    async getCatalog() {
      const pool = createDatabasePool();
      try {
        const result = await pool.query<CatalogDatabaseRow>(`
          SELECT s.source_id, s.organization, s.base_url, s.terms_url, s.redistribution_status, s.reviewed_at,
                 d.dataset_id, d.name, d.scope, d.update_frequency, d.schema_version, d.status,
                 count(a.artifact_id) AS artifact_count, max(a.collected_at) AS latest_collection
          FROM sources s JOIN datasets d ON d.source_id = s.source_id
          LEFT JOIN artifacts a ON a.dataset_id = d.dataset_id
          GROUP BY s.source_id, s.organization, s.base_url, s.terms_url, s.redistribution_status, s.reviewed_at,
                   d.dataset_id, d.name, d.scope, d.update_frequency, d.schema_version, d.status
          ORDER BY d.dataset_id;
        `);
        return createDatasetCatalogResponse(result.rows.map((row) => ({
          sourceId: row.source_id, organization: row.organization, baseUrl: row.base_url, termsUrl: row.terms_url,
          redistributionStatus: row.redistribution_status, reviewedAt: row.reviewed_at?.toISOString() ?? null,
          datasetId: row.dataset_id, name: row.name, scope: row.scope, updateFrequency: row.update_frequency,
          schemaVersion: row.schema_version, status: row.status, artifactCount: Number(row.artifact_count),
          latestCollection: row.latest_collection?.toISOString() ?? null,
        })));
      } finally { await pool.end(); }
    },
    async getEntities() {
      const pool = createDatabasePool();
      try {
        const result = await pool.query<EntityDatabaseRow>(`
          SELECT e.canonical_name, ea.alias_text, ea.resolution_status, ea.confidence,
                 s.source_id, d.dataset_id, s.organization AS source_organization, d.name AS dataset_name, a.sha256 AS artifact_sha256, ea.locator
          FROM entity_aliases ea
          JOIN artifacts a ON a.artifact_id = ea.artifact_id
          JOIN datasets d ON d.dataset_id = a.dataset_id
          JOIN sources s ON s.source_id = d.source_id
          LEFT JOIN entities e ON e.entity_id = ea.entity_id
          ORDER BY ea.created_at;
        `);
        const entities = result.rows.map((row) => ({
          canonicalName: row.canonical_name, aliasText: row.alias_text, resolutionStatus: row.resolution_status,
          confidence: row.confidence, sourceOrganization: row.source_organization, datasetName: row.dataset_name,
          artifactSha256: row.artifact_sha256, locator: row.locator,
        }));
        return createCommonResponse({
          status: 'ok', data: { entities },
          evidence: result.rows.map((row) => ({ sourceId: row.source_id, datasetId: row.dataset_id, artifactSha256: row.artifact_sha256, locator: row.locator })),
          coverage: { scope: 'aliases de orgaos e secretarias municipais do piloto LOA 2026', status: 'pilot' },
          limitations: ['Nao inclui empresas, contratos, licitacoes ou pessoas.', 'Aliases needs_review nao representam entidade confirmada.'],
          confidence: entities.some((entity) => entity.confidence === 'needs_review') ? 'needs_review' : 'high',
          metadata: { municipality: 'Itapevi' },
        });
      } finally { await pool.end(); }
    },
    async getBudgetSummary() {
      const pool = createDatabasePool();
      try {
        const result = await pool.query<{ payload: { filters: Record<string, string>; recordCount: number; totals: { plannedAmount: number; realizedAmount: number }; exportedAt: string }; sha256: string; dataset_name: string }>(`
          SELECT e.payload, a.sha256, d.name AS dataset_name
          FROM events e JOIN processing_runs pr ON pr.run_id = e.run_id
          JOIN artifacts a ON a.artifact_id = pr.artifact_id JOIN datasets d ON d.dataset_id = a.dataset_id
          WHERE e.event_type = 'municipal_budget_panel_exported' AND e.status = 'candidate'
          ORDER BY e.created_at DESC;
        `);
        const exports = result.rows.map((row) => ({
          ...row.payload,
          totals: {
            plannedAmount: Math.round(row.payload.totals.plannedAmount * 100) / 100,
            realizedAmount: Math.round(row.payload.totals.realizedAmount * 100) / 100,
          },
          artifactSha256: row.sha256,
          datasetName: row.dataset_name,
        }));
        return createCommonResponse({
          status: 'ok', data: { exports },
          evidence: result.rows.map((row) => ({ sourceId: 'SRC-PREF-LAI-001', datasetId: 'DS-LAI-PREVISTO-EMPENHADO-2026', artifactSha256: row.sha256 })),
          coverage: { scope: 'exportacoes agregadas do painel LAI, conforme filtros de cada arquivo', status: 'pilot' },
          limitations: ['Totais representam somente as linhas retornadas pelos filtros.', 'Nao substitui empenhos individuais ou toda a execucao orcamentaria.'],
          confidence: 'needs_review', metadata: { municipality: 'Itapevi' },
        });
      } finally { await pool.end(); }
    },
  };
}
