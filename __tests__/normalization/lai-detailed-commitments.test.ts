import { normalizeLaiDetailedCommitmentsCsv } from '../../src/normalization/lai-detailed-commitments';

describe('normalizacao de empenhos detalhados LAI', () => {
  const header = 'Nro Empenho|Nro Processo|Data Empenho|Descrição Empenho|Função|Sub Função|Aplicação|Unidade Orçamentária|Programa|Ação|Empenho Original|Valor Processado|Valor Pago';
  it('normaliza acentos do cabeçalho e valores monetarios brasileiros', () => {
    const csv = `${header}\n123|456|02/09/2026|"Servico de alimentação"|Saúde|Atenção básica|Samu - 192|Secretaria de Saúde|Programa|Ação|1.234,56|1.000,00|900,50\n`;
    expect(normalizeLaiDetailedCommitmentsCsv(csv)).toEqual([expect.objectContaining({ commitmentNumber: '123', committedOn: '2026-09-02', budgetUnit: 'Secretaria de Saúde', originalAmount: 1234.56, paidAmount: 900.5 })]);
  });
});
