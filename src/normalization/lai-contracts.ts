import { parse } from 'csv-parse/sync';

export interface LaiContract {
  year: number;
  number: string;
  type: string;
  supplierDocumentMasked: string;
  supplier: string;
  startsOn: string;
  endsOn: string;
  contractedAmount: number;
  committedAmount: number;
  processedAmount: number;
  paidAmount: number;
  object: string;
  procurementProcess: string;
  managingSecretariat: string;
}

type RawRow = Record<string, string>;

function required(row: RawRow, key: string, line: number): string {
  const value = row[key]?.trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: linha ${line}.${key}`);
  return value;
}

function amount(row: RawRow, key: string, line: number): number {
  const value = Number(required(row, key, line));
  if (!Number.isFinite(value)) throw new Error(`Valor numerico invalido: linha ${line}.${key}`);
  return Math.round(value * 100) / 100;
}

function isoDate(value: string, line: number, key: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) throw new Error(`Data invalida: linha ${line}.${key}`);
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function maskSupplierDocument(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 14) return `${digits.slice(0, 2)}.***.***/****-${digits.slice(-2)}`;
  if (digits.length === 11) return `***.***.***-${digits.slice(-2)}`;
  return 'documento_indisponivel';
}

export function normalizeLaiContractsCsv(text: string): LaiContract[] {
  const rows = parse(text, { columns: true, delimiter: '|', skip_empty_lines: true, trim: true }) as RawRow[];
  if (!rows.length) throw new Error('CSV deve conter ao menos um contrato.');
  return rows.map((row, index) => {
    const line = index + 2;
    const year = Number(required(row, 'Ano', line));
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error(`Ano invalido: linha ${line}.Ano`);
    return {
      year, number: required(row, 'Nro', line), type: required(row, 'Tipo', line),
      supplierDocumentMasked: maskSupplierDocument(required(row, 'CNPJ/CPF', line)), supplier: required(row, 'Fornecedor', line),
      startsOn: isoDate(required(row, 'Data Inicial', line), line, 'Data Inicial'),
      endsOn: isoDate(required(row, 'Data final', line), line, 'Data final'),
      contractedAmount: amount(row, 'Valor Contratado', line), committedAmount: amount(row, 'Valor Empenhado', line),
      processedAmount: amount(row, 'Valor Processado', line), paidAmount: amount(row, 'Valor Pago', line),
      object: required(row, 'Objeto Contrato', line), procurementProcess: required(row, 'Processo Licitatório', line),
      managingSecretariat: required(row, 'Secretaria Gestor', line),
    };
  });
}
