export interface LaiBudgetRecord {
  program: string;
  action: string;
  responsibleBody: string;
  plannedAmount: number;
  realizedAmount: number;
}

export interface LaiBudgetExport {
  origin: string;
  exportedAt: string;
  filters: Record<string, string>;
  records: LaiBudgetRecord[];
  totals: { plannedAmount: number; realizedAmount: number };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value.trim();
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Valor numerico invalido: ${field}`);
  return value;
}

function sumCurrency(values: number[]): number {
  return Math.round(values.reduce((sum, value) => sum + value, 0) * 100) / 100;
}

export function normalizeLaiBudgetJson(text: string): LaiBudgetExport {
  const source = JSON.parse(text) as { Origem?: unknown; DataExportacao?: unknown; Filtros?: unknown; Valores?: unknown };
  const filters = Object.fromEntries((Array.isArray(source.Filtros) ? source.Filtros : []).map((item) => {
    const filter = item as { Nome?: unknown; Valor?: unknown };
    return [requiredString(filter.Nome, 'Filtros.Nome'), typeof filter.Valor === 'string' ? filter.Valor : String(filter.Valor ?? '')];
  }));
  if (!Array.isArray(source.Valores) || source.Valores.length === 0) throw new Error('Valores deve conter ao menos um registro.');
  const records = source.Valores.map((item, index) => {
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
  return {
    origin: requiredString(source.Origem, 'Origem'),
    exportedAt: requiredString(source.DataExportacao, 'DataExportacao'),
    filters,
    records,
    totals: {
      plannedAmount: sumCurrency(records.map((record) => record.plannedAmount)),
      realizedAmount: sumCurrency(records.map((record) => record.realizedAmount)),
    },
  };
}
