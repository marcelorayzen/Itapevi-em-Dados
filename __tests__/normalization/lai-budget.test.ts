import { normalizeLaiBudgetJson } from '../../src/normalization/lai-budget';

describe('normalizacao da exportacao LAI', () => {
  it('preserva filtros, registros e totais sem inferir significado', () => {
    const result = normalizeLaiBudgetJson(JSON.stringify({
      Origem: 'LAI - Previsto e Empenhado', DataExportacao: '27/10/2026 14:27:01',
      Filtros: [{ Nome: 'Data Inicial', Valor: '2026/09/01' }],
      Valores: [{
        'Programa de Governo': 'Gestao do Governo', Ação: 'Manutencao', 'Órgão Responsável': 'Secretaria de Governo',
        'Quanto foi previsto': 100, 'Quanto já foi realizado <br>(Empenhado ou Pago)': 25,
      }],
    }));
    expect(result.filters['Data Inicial']).toBe('2026/09/01');
    expect(result.records[0]).toMatchObject({ program: 'Gestao do Governo', plannedAmount: 100, realizedAmount: 25 });
    expect(result.totals).toEqual({ plannedAmount: 100, realizedAmount: 25 });
  });
});
