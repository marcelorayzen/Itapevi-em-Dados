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
});

describe('demonstracao web local', () => {
  it('exibe pagina local e endpoints somente leitura', async () => {
    const page = await request(app).get('/demo');
    const catalog = await request(app).get('/api/demo/catalog');
    const entities = await request(app).get('/api/demo/entities');

    expect(page.status).toBe(200);
    expect(page.text).toContain('Demonstracao local');
    expect(catalog.body.contractVersion).toBe('1.0');
    expect(entities.body.data.entities).toEqual([]);
  });
});
