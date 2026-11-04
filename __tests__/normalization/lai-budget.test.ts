import { normalizeLaiBudgetCsv, normalizeLaiBudgetJson } from '../../src/normalization/lai-budget';

describe('normalizacao da exportacao LAI', () => {
  it('preserva filtros, registros e totais sem inferir significado', () => {
    const result = normalizeLaiBudgetJson(JSON.stringify({
      Origem: 'LAI - Previsto e Empenhado', DataExportacao: '27/10/2026 14:27:01',
      Filtros: [{ Nome: 'Data Inicial', Valor: '2026/09/01' }, { Nome: 'Data Final', Valor: '2026/09/30' }, { Nome: 'Filtrar por:', Valor: 'Data de Empenho' }],
      Valores: [{
        'Programa de Governo': 'Gestao do Governo', Ação: 'Manutencao', 'Órgão Responsável': 'Secretaria de Governo',
        'Quanto foi previsto': 100, 'Quanto já foi realizado <br>(Empenhado ou Pago)': 25,
      }],
    }));
    expect(result.filters['Data Inicial']).toBe('2026/09/01');
    expect(result.period).toEqual({ start: '2026-09-01', end: '2026-09-30', temporalFilter: 'Data de Empenho', source: 'export_metadata' });
    expect(result.records[0]).toMatchObject({ program: 'Gestao do Governo', plannedAmount: 100, realizedAmount: 25 });
    expect(result.totals).toEqual({ plannedAmount: 100, realizedAmount: 25 });
  });

  it('normaliza CSV somente com periodo confirmado e preserva sua origem', () => {
    const result = normalizeLaiBudgetCsv([
      '"Programa de Governo"|"Ação"|"Órgão Responsável"|"Quanto foi previsto"|"Quanto já foi realizado <br>(Empenhado ou Pago)"',
      '"Gestao"|"Manutencao"|"Secretaria de Governo"|1.234,50|456,75',
    ].join('\n'), { periodStart: '2026-10-01', periodEnd: '2026-10-31', temporalFilter: 'Data de Empenho', exportedAt: '2026-10-31T23:59:00.000Z' });

    expect(result.period).toEqual({ start: '2026-10-01', end: '2026-10-31', temporalFilter: 'Data de Empenho', source: 'operator_confirmed' });
    expect(result.records[0]).toMatchObject({ plannedAmount: 1234.5, realizedAmount: 456.75 });
  });

  it('recusa CSV sem periodo confirmado', () => {
    expect(() => normalizeLaiBudgetCsv('"Programa de Governo"|"Ação"|"Órgão Responsável"|"Quanto foi previsto"|"Quanto já foi realizado <br>(Empenhado ou Pago)"', { periodStart: '', periodEnd: '2026-10-31', temporalFilter: 'Data de Empenho', exportedAt: '2026-10-31T23:59:00.000Z' })).toThrow('Campo obrigatorio ausente');
  });
});
