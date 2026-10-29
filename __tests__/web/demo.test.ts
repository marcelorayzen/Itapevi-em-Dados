import request from 'supertest';
import { createCommonResponse } from '../../src/contracts/response';
import { createApp } from '../../src/app';
import { sha256 } from '../../src/api/preview-guard';

const provider = {
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
  getPreviewCatalog: async () => createCommonResponse({
    status: 'partial', data: { datasets: [] }, evidence: [], coverage: { scope: 'teste', status: 'pilot' }, limitations: [], confidence: 'needs_review', metadata: { municipality: 'Itapevi' },
  }),
};

const app = createApp(provider);

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

  it('mantem a previa privada desativada por padrao', async () => {
    const response = await request(app).get('/api/preview/v1/catalog');

    expect(response.status).toBe(404);
    expect(response.body.contractVersion).toBe('1.0');
  });

  it('exige chave, origem permitida e respeita o limite da previa privada', async () => {
    const previewApp = createApp(provider, { enabled: true, keyHashes: [sha256('chave-de-teste')], allowedOrigins: ['https://preview.example.test'], rateLimitPerMinute: 2, now: () => 1_000 });
    const denied = await request(previewApp).get('/api/preview/v1/catalog');
    const blockedOrigin = await request(previewApp).get('/api/preview/v1/catalog').set('Authorization', 'Bearer chave-de-teste').set('Origin', 'https://nao-permitida.example.test');
    const allowed = await request(previewApp).get('/api/preview/v1/catalog').set('Authorization', 'Bearer chave-de-teste').set('Origin', 'https://preview.example.test');
    const second = await request(previewApp).get('/api/preview/v1/catalog').set('Authorization', 'Bearer chave-de-teste');
    const limited = await request(previewApp).get('/api/preview/v1/catalog').set('Authorization', 'Bearer chave-de-teste');

    expect(denied.status).toBe(401);
    expect(blockedOrigin.status).toBe(403);
    expect(allowed.status).toBe(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('https://preview.example.test');
    expect(second.status).toBe(200);
    expect(limited.status).toBe(429);
    expect(limited.headers['retry-after']).toBe('60');
  });
});
