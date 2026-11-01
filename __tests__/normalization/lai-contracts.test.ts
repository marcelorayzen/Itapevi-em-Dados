import { maskSupplierDocument, normalizeLaiContractsCsv } from '../../src/normalization/lai-contracts';

describe('normalizacao de contratos LAI', () => {
  const header = '"Ano"|"Nro"|"Tipo"|"CNPJ/CPF"|"Fornecedor"|"Data Inicial"|"Data final"|"Valor Contratado"|"Valor Empenhado"|"Valor Processado"|"Valor Pago"|"Objeto Contrato"|"Processo Licitatório"|"Gestor do Contrato"|"Fiscal do Contrato"|"Secretaria Gestor"';
  it('normaliza contrato e nao devolve documento de fornecedor integral', () => {
    const csv = `${header}\n"2026"|"1"|"Obras"|"28.924.018/0001-07"|"Empresa"|"07/01/2026"|"09/03/2027"|10|8|7|6|"Obra"|"Concorrencia (1/2026)"|"Pessoa"|""|"Secretaria"\n`;
    expect(normalizeLaiContractsCsv(csv)).toEqual([expect.objectContaining({ year: 2026, supplierDocumentMasked: '28.***.***/****-07', startsOn: '2026-01-07', paidAmount: 6 })]);
  });
  it('mascara CPF', () => expect(maskSupplierDocument('030.456.318-86')).toBe('***.***.***-86'));
});
