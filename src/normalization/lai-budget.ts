import { parse } from 'csv-parse/sync';

export interface LaiBudgetRecord {
  program: string;
  action: string;
  responsibleBody: string;
  plannedAmount: number;
  realizedAmount: number;
}

export interface LaiBudgetPeriod {
  start: string;
  end: string;
  temporalFilter: string;
  source: 'export_metadata' | 'operator_confirmed';
}

export interface LaiBudgetExport {
  origin: string;
  exportedAt: string;
  filters: Record<string, string>;
  period: LaiBudgetPeriod;
  records: LaiBudgetRecord[];
  totals: { plannedAmount: number; realizedAmount: number };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value.trim();
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const compact = value.trim().replace(/\s/g, '');
    const normalized = compact.includes(',')
      ? compact.replace(/\./g, '').replace(',', '.')
      : compact;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(`Valor numerico invalido: ${field}`);
}

function sumCurrency(values: number[]): number {
  return Math.round(values.reduce((sum, value) => sum + value, 0) * 100) / 100;
}

function normalizedDate(value: unknown, field: string): string {
  const raw = requiredString(value, field).replace(/\//g, '-');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error(`Data invalida: ${field}`);
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== raw) throw new Error(`Data invalida: ${field}`);
  return raw;
}

function periodFromFilters(filters: Record<string, string>): LaiBudgetPeriod {
  const start = filters['Data Inicial'];
  const end = filters['Data Final'];
  const temporalFilter = filters['Filtrar por:'] ?? filters['Filtrar por'];
  if (!temporalFilter?.trim()) throw new Error('Filtro temporal ausente na exportacao LAI.');
  const normalizedStart = normalizedDate(start, 'Filtros.Data Inicial');
  const normalizedEnd = normalizedDate(end, 'Filtros.Data Final');
  if (normalizedStart > normalizedEnd) throw new Error('Data Inicial nao pode ser posterior a Data Final.');
  return { start: normalizedStart, end: normalizedEnd, temporalFilter: temporalFilter.trim(), source: 'export_metadata' };
}

function normalizeRecords(values: unknown[]): LaiBudgetRecord[] {
  if (!values.length) throw new Error('Valores deve conter ao menos um registro.');
  return values.map((item, index) => {
    const row = item as Record<string, unknown>;
    const realizedKey = Object.keys(row).find((key) => key.startsWith('Quanto j') && key.includes('realizado'));
    if (!realizedKey) throw new Error(`Campo de valor realizado ausente no registro ${index}.`);
    return {
      program: requiredString(row['Programa de Governo'], `Valores[${index}].Programa de Governo`),
      action: requiredString(row['Ação'], `Valores[${index}].Ação`),
      responsibleBody: requiredString(row['Órgão Responsável'], `Valores[${index}].Órgão Responsável`),
      plannedAmount: requiredNumber(row['Quanto foi previsto'], `Valores[${index}].Quanto foi previsto`),
      realizedAmount: requiredNumber(row[realizedKey], `Valores[${index}].${realizedKey}`),
    };
  });
}

function buildExport(origin: unknown, exportedAt: unknown, filters: Record<string, string>, period: LaiBudgetPeriod, values: unknown[]): LaiBudgetExport {
  const records = normalizeRecords(values);
  return {
    origin: requiredString(origin, 'Origem'),
    exportedAt: requiredString(exportedAt, 'DataExportacao'),
    filters,
    period,
    records,
    totals: {
      plannedAmount: sumCurrency(records.map((record) => record.plannedAmount)),
      realizedAmount: sumCurrency(records.map((record) => record.realizedAmount)),
    },
  };
}

export function normalizeLaiBudgetJson(text: string): LaiBudgetExport {
  const source = JSON.parse(text) as { Origem?: unknown; DataExportacao?: unknown; Filtros?: unknown; Valores?: unknown };
  const filters = Object.fromEntries((Array.isArray(source.Filtros) ? source.Filtros : []).map((item) => {
    const filter = item as { Nome?: unknown; Valor?: unknown };
    return [requiredString(filter.Nome, 'Filtros.Nome'), typeof filter.Valor === 'string' ? filter.Valor : String(filter.Valor ?? '')];
  }));
  if (!Array.isArray(source.Valores)) throw new Error('Valores deve conter ao menos um registro.');
  return buildExport(source.Origem, source.DataExportacao, filters, periodFromFilters(filters), source.Valores);
}

export function normalizeLaiBudgetCsv(text: string, input: { periodStart: string; periodEnd: string; temporalFilter: string; exportedAt: string; origin?: string }): LaiBudgetExport {
  const values = parse(text, { bom: true, columns: true, delimiter: '|', trim: true, skip_empty_lines: true, relax_quotes: true }) as Record<string, unknown>[];
  const period: LaiBudgetPeriod = {
    start: normalizedDate(input.periodStart, 'periodStart'),
    end: normalizedDate(input.periodEnd, 'periodEnd'),
    temporalFilter: requiredString(input.temporalFilter, 'temporalFilter'),
    source: 'operator_confirmed',
  };
  if (period.start > period.end) throw new Error('periodStart nao pode ser posterior a periodEnd.');
  const filters = {
    'Data Inicial': period.start,
    'Data Final': period.end,
    'Filtrar por:': period.temporalFilter,
    'Origem do periodo': 'confirmacao do operador a partir da tela oficial de exportacao',
  };
  return buildExport(input.origin ?? 'LAI - Previsto e Empenhado por Programa e Secretaria (CSV)', input.exportedAt, filters, period, values);
}
