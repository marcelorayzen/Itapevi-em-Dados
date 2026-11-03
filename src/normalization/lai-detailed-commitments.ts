import { parse } from 'csv-parse/sync';

export interface LaiDetailedCommitment {
  commitmentNumber: string;
  processNumber: string | null;
  committedOn: string;
  description: string;
  functionName: string | null;
  subfunctionName: string | null;
  applicationName: string | null;
  budgetUnit: string;
  program: string;
  action: string;
  originalAmount: number;
  processedAmount: number;
  paidAmount: number;
}

type RawRow = Record<string, string>;

function headerKey(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function value(row: RawRow, key: string): string | undefined {
  const raw = Object.entries(row).find(([header]) => headerKey(header) === key)?.[1]?.trim();
  if (!raw) return raw;
  return raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1).replace(/""/g, '"').trim() : raw;
}

function required(row: RawRow, key: string, line: number): string {
  const found = value(row, key);
  if (!found) throw new Error(`Campo obrigatorio ausente: linha ${line}.${key}`);
  return found;
}

function optional(row: RawRow, key: string): string | null { return value(row, key) || null; }

function amount(row: RawRow, key: string, line: number): number {
  const numeric = Number(required(row, key, line).replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(numeric)) throw new Error(`Valor numerico invalido: linha ${line}.${key}`);
  return Math.round(numeric * 100) / 100;
}

function isoDate(raw: string, line: number): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (!match) throw new Error(`Data invalida: linha ${line}.dataempenho`);
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function normalizeLaiDetailedCommitmentsCsv(text: string): LaiDetailedCommitment[] {
  const rows = parse(text, { columns: true, delimiter: '|', skip_empty_lines: true, trim: true, quote: false, bom: true }) as RawRow[];
  if (!rows.length) throw new Error('CSV deve conter ao menos um empenho.');
  return rows.map((row, index) => {
    const line = index + 2;
    return {
      commitmentNumber: required(row, 'nroempenho', line), processNumber: optional(row, 'nroprocesso'),
      committedOn: isoDate(required(row, 'dataempenho', line), line), description: required(row, 'descricaoempenho', line),
      functionName: optional(row, 'funcao'), subfunctionName: optional(row, 'subfuncao'), applicationName: optional(row, 'aplicacao'),
      budgetUnit: required(row, 'unidadeorcamentaria', line), program: required(row, 'programa', line), action: required(row, 'acao', line),
      originalAmount: amount(row, 'empenhooriginal', line), processedAmount: amount(row, 'valorprocessado', line), paidAmount: amount(row, 'valorpago', line),
    };
  });
}
