import { answerQuestion } from '../../src/app';
import { createCommonResponse } from '../../src/contracts/response';
import type { DemoDataProvider } from '../../src/web/demo-data';

const empty = () => createCommonResponse({
  status: 'ok', data: { exports: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }],
  coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
});

const provider: DemoDataProvider = {
  getCatalog: async () => createCommonResponse({ status: 'ok', data: { datasets: [] }, evidence: [], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' } }),
  getEntities: async () => createCommonResponse({ status: 'ok', data: { entities: [] }, evidence: [], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' } }),
  getBudgetSummary: async () => empty(),
  getDemographics: async () => createCommonResponse({ status: 'ok', data: { estimates: [] }, evidence: [], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' } }),
  getHistoricalExpenses: async () => createCommonResponse({ status: 'ok', data: { periods: [] }, evidence: [], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' } }),
  getProcurementSummary: async () => createCommonResponse({
    status: 'ok',
    data: { exports: [{ records: 2, totals: { purchasedAmount: 30, estimatedAmount: 50 }, modalities: [{ modality: 'Pregão', purchasedAmount: 30 }] }] },
    evidence: [{ sourceId: 'SRC-PREF-LAI-001', datasetId: 'DS-LAI-COMPRAS-MODALIDADE-2026', artifactSha256: 'CHECKSUM-TESTE' }],
    coverage: { scope: 'teste de compras agregadas', status: 'pilot' }, limitations: ['Sem processos individuais.'], confidence: 'needs_review', metadata: { municipality: 'Itapevi' },
  }),
};

describe('perguntas guiadas de compras', () => {
  it('responde com totais, modalidade e evidencia do dado agregado', async () => {
    const response = await answerQuestion('Quanto foi comprado por modalidade?', provider);

    expect(response.status).toBe('ok');
    expect(response.data.answer).toContain('2 registros de compras');
    expect(response.data.answer).toContain('Pregão');
    expect(response.evidence).toEqual([{ sourceId: 'SRC-PREF-LAI-001', datasetId: 'DS-LAI-COMPRAS-MODALIDADE-2026', artifactSha256: 'CHECKSUM-TESTE' }]);
  });
});
