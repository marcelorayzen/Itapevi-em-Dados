import { createCommonResponse, type CommonResponse } from '../contracts/response.js';

export interface DatasetCatalogRow {
  sourceId: string;
  organization: string;
  baseUrl: string;
  termsUrl: string | null;
  redistributionStatus: 'pending_review' | 'allowed' | 'restricted' | 'prohibited';
  reviewedAt: string | null;
  datasetId: string;
  name: string;
  scope: string;
  updateFrequency: string | null;
  schemaVersion: string;
  status: 'candidate' | 'active' | 'paused' | 'retired';
  artifactCount: number;
  latestCollection: string | null;
}

export interface DatasetCatalogItem {
  id: string;
  name: string;
  scope: string;
  updateFrequency: string | null;
  schemaVersion: string;
  status: string;
  artifacts: { count: number; latestCollection: string | null };
  source: {
    id: string;
    organization: string;
    baseUrl: string;
    termsUrl: string | null;
    redistributionStatus: string;
    reviewedAt: string | null;
  };
}

export function createDatasetCatalogResponse(rows: DatasetCatalogRow[]): CommonResponse<{ datasets: DatasetCatalogItem[] }> {
  const datasets = rows.map((row) => ({
    id: row.datasetId,
    name: row.name,
    scope: row.scope,
    updateFrequency: row.updateFrequency,
    schemaVersion: row.schemaVersion,
    status: row.status,
    artifacts: { count: row.artifactCount, latestCollection: row.latestCollection },
    source: {
      id: row.sourceId,
      organization: row.organization,
      baseUrl: row.baseUrl,
      termsUrl: row.termsUrl,
      redistributionStatus: row.redistributionStatus,
      reviewedAt: row.reviewedAt,
    },
  }));

  return createCommonResponse({
    status: 'ok',
    data: { datasets },
    evidence: rows.map((row) => ({
      sourceId: row.sourceId,
      datasetId: row.datasetId,
      sourceUrl: row.baseUrl,
      collectedAt: row.latestCollection ?? undefined,
    })),
    coverage: {
      scope: 'datasets catalogados no PostgreSQL local para Itapevi',
      status: 'pilot',
      excluded: ['Fontes nao registradas no catalogo e dados sem revisao de termos.'],
    },
    limitations: [
      'Catalogo inicial: o status de redistribuicao deve ser revisado por fonte.',
      'A listagem nao autoriza publicacao ou redistribuicao de dados derivados.',
    ],
    confidence: rows.every((row) => row.redistributionStatus === 'allowed') ? 'high' : 'needs_review',
    metadata: { municipality: 'Itapevi' },
  });
}
