import { normalizeLoaMarkdown, parseBrazilianCurrency } from '../../src/normalization/loa';

const sample = `
LEI Nº 9.999, DE 7 DE JANEIRO DE 2030.
"ESTIMA A RECEITA E FIXA A DESPESA DO MUNICÍPIO PARA O EXERCÍCIO DE 2031."
Art. 1º Esta Lei estima a Receita e fixa a Despesa do Município para o exercício financeiro de 2031.
Art. 2º A Receita Orçamentária é estimada em R$ 10.000,00 e se desdobra em:
I - R$ 8.000,00 do Orçamento Fiscal; e
II - R$ 2.000,00 do Orçamento da Seguridade Social.
`;

describe('normalizeLoaMarkdown', () => {
  it('normaliza apenas os campos declarados no corpo da lei', () => {
    expect(normalizeLoaMarkdown(sample)).toMatchObject({
      type: 'municipal_budget_law',
      status: 'candidate',
      lawNumber: '9.999',
      lawDate: '2030-01-07',
      exercise: 2031,
      totals: { overall: 10000, fiscal: 8000, socialSecurity: 2000 },
    });
  });

  it('rejeita entrada sem os totais exigidos', () => {
    expect(() => normalizeLoaMarkdown('LEI Nº 9.999, DE 7 DE JANEIRO DE 2030.')).toThrow('exercício');
  });

  it('converte moeda brasileira de forma determinística', () => {
    expect(parseBrazilianCurrency('1.234.567,89')).toBe(1234567.89);
  });
});
