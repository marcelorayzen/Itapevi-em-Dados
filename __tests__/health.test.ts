import request from 'supertest';
import app from '../src/app';

describe('HTTP health endpoint', () => {
  it('deve retornar status ok e incluir dados_ibge', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.tools).toContain('dados_ibge');
  });
});
