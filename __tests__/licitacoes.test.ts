import { handler } from '../src/tools/licitacoes';

describe('buscar_licitacoes tool', () => {
  it('deve filtrar por ano e modalidade', async () => {
    const response = await handler({ ano: 2024, modalidade: 'Pregão' });

    expect(response.content[0].text).toContain('Licitações de Itapevi');
    expect(response.content[0].text).toContain('Pregão');
  });
});
