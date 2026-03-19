import { healthCheck } from '../src/health';

describe('healthCheck', () => {
  it('deve retornar status ok e lista de ferramentas', () => {
    const r = healthCheck();
    expect(r.status).toBe('ok');
    expect(r.tools).toContain('dados_ibge');
  });
});
