import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { flushCache } from '../src/utils/cache';
import { handler } from '../src/tools/ibge';

describe('dados_ibge tool', () => {
  afterEach(() => flushCache());

  it('retorna a estimativa mais recente da serie oficial do IBGE', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3522505').reply(200, { nome: 'Itapevi', microrregiao: { mesorregiao: { UF: { sigla: 'SP' } } } });
    mock.onGet('https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29171/resultados/3522505').reply(200, [{ res: [{ res: { '2025': '242995', '2026': '243967' } }] }]);

    const response = await handler({});

    expect(response.content[0].text).toContain('243.967 habitantes (2026)');
    expect(response.content[0].text).toContain('indicador 29171');
    expect(response.content[0].text).toContain('nao informa area territorial, densidade ou PIB');
    mock.restore();
  });

  it('nao produz estimativa quando a serie oficial e invalida', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3522505').reply(200, { nome: 'Itapevi' });
    mock.onGet('https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29171/resultados/3522505').reply(200, [{ res: [{ res: {} }] }]);

    const response = await handler({});

    expect(response.content[0].text).toContain('Nao foi possivel obter');
    mock.restore();
  });
});
