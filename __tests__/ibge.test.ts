import { handler } from '../src/tools/ibge';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('dados_ibge tool', () => {
  it('deve retornar dados formatados usando API do IBGE', async () => {
    const mock = new MockAdapter(axios);

    mock
      .onGet('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3522505/estatisticas')
      .reply(200, { populacao_estimada: 232000, area_km2: 82.66 });

    mock
      .onGet('https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-6/variaveis/979?localidades=3522505')
      .reply(200, [
        {
          resultados: [
            {
              series: [
                {
                  serie: { '2019': '3200000000', '2021': '3500000000' },
                },
              ],
            },
          ],
        },
      ]);

    const response = await handler({});

    expect(response.content).toBeDefined();
    expect(response.content[0].text).toContain('População estimada');
    expect(response.content[0].text).toContain('PIB estimado (último ano disponível)');

    mock.restore();
  });
});
