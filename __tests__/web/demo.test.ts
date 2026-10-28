import request from 'supertest';
import { createCommonResponse } from '../../src/contracts/response';
import { createApp } from '../../src/app';

const app = createApp({
  getCatalog: async () => createCommonResponse({
    status: 'ok', data: { datasets: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }],
    coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
  getEntities: async () => createCommonResponse({
    status: 'ok', data: { entities: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }],
    coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
  getBudgetSummary: async () => createCommonResponse({
    status: 'ok', data: { exports: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }],
    coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
  getDemographics: async () => createCommonResponse({
    status: 'ok', data: { estimates: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }],
    coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
  getHistoricalExpenses: async () => createCommonResponse({
    status: 'ok', data: { periods: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
  getProcurementSummary: async () => createCommonResponse({
    status: 'ok', data: { exports: [] }, evidence: [{ sourceId: 'SRC', datasetId: 'DS' }], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'high', metadata: { municipality: 'Itapevi' },
  }),
});

describe('demonstracao web local', () => {
  it('exibe pagina local e endpoints somente leitura', async () => {
    const page = await request(app).get('/demo');
    const catalog = await request(app).get('/api/demo/catalog');
    const entities = await request(app).get('/api/demo/entities');
    const budget = await request(app).get('/api/demo/budget');
    const demographics = await request(app).get('/api/demo/demographics');
    const historical = await request(app).get('/api/demo/historical-expenses');
    const procurement = await request(app).get('/api/demo/procurement');

    expect(page.status).toBe(200);
    expect(page.text).toContain('Demonstracao local');
    expect(catalog.body.contractVersion).toBe('1.0');
    expect(entities.body.data.entities).toEqual([]);
    expect(budget.body.data.exports).toEqual([]);
    expect(demographics.body.data.estimates).toEqual([]);
    expect(historical.body.data.periods).toEqual([]);
    expect(procurement.body.data.exports).toEqual([]);
  });

  it('recusa classificacao acusatoria e explica o limite do ADR-011', async () => {
    const response = await request(app).get('/api/demo/query').query({ q: 'Qual empresa cometeu fraude?' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('not_found');
    expect(response.body.data.answer).toContain('nao classifica');
    expect(response.body.data.answer).not.toContain('cometeu fraude');
    expect(response.body.limitations).toContain('Indicadores descritivos nao comprovam conduta, ilegalidade ou responsabilidade.');
  });
});
