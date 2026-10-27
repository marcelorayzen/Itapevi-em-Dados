import { createDatasetCatalogResponse } from '../../src/catalog/dataset-catalog';

describe('catalogo de datasets', () => {
  it('explicita termos pendentes e limites do piloto', () => {
    const response = createDatasetCatalogResponse([{
      sourceId: 'SRC-LOA-2026-001',
      organization: 'Prefeitura do Municipio de Itapevi',
      baseUrl: 'https://itapevi.sp.gov.br/',
      termsUrl: null,
      redistributionStatus: 'pending_review',
      reviewedAt: null,
      datasetId: 'DS-LOA-2026',
      name: 'LOA 2026',
      scope: 'Piloto',
      updateFrequency: 'anual',
      schemaVersion: 'f1-v1',
      status: 'candidate',
      artifactCount: 1,
      latestCollection: '2026-10-25T23:10:04.480Z',
    }]);

    expect(response.contractVersion).toBe('1.0');
    expect(response.data.datasets[0].source.redistributionStatus).toBe('pending_review');
    expect(response.confidence).toBe('needs_review');
    expect(response.limitations).toContain('Catalogo inicial: o status de redistribuicao deve ser revisado por fonte.');
  });
});
