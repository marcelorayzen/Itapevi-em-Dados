import { parse } from 'csv-parse/sync';

export interface LaiProcurementModality {
  modality: string;
  records: number;
  priceRegistrationTotal: number;
  purchasedAmount: number;
  estimatedAmount: number;
  items: number;
}

export interface LaiProcurementExport {
  records: number;
  totals: {
    priceRegistrationTotal: number;
    purchasedAmount: number;
    estimatedAmount: number;
    items: number;
  };
  modalities: LaiProcurementModality[];
}

type RawRow = Record<string, string>;

function numberField(value: string | undefined, field: string): number {
  const parsed = Number(value ?? '');
  if (!Number.isFinite(parsed)) throw new Error(`Valor numerico invalido: ${field}`);
  return parsed;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function sum(values: number[]): number {
  return roundCurrency(values.reduce((total, value) => total + value, 0));
}

export function normalizeLaiProcurementCsv(text: string): LaiProcurementExport {
  const rows = parse(text, { columns: true, delimiter: '|', skip_empty_lines: true, trim: true }) as RawRow[];
  if (rows.length === 0) throw new Error('CSV deve conter ao menos um registro.');

  const totalRow = rows.find((row) => row.Modalidade === 'TOTAL');
  const detailRows = rows.filter((row) => row.Modalidade && row.Modalidade !== 'TOTAL');
  if (detailRows.length === 0) throw new Error('CSV nao contem registros de compras por modalidade.');

  const normalized = detailRows.map((row, index) => ({
    modality: row.Modalidade.trim(),
    priceRegistrationTotal: numberField(row['Total registro de preço'], `linha ${index}.Total registro de preço`),
    purchasedAmount: numberField(row['Valor comprado'], `linha ${index}.Valor comprado`),
    estimatedAmount: numberField(row['Valor estimado'], `linha ${index}.Valor estimado`),
    items: numberField(row.Itens, `linha ${index}.Itens`),
  }));

  const byModality = new Map<string, LaiProcurementModality>();
  for (const row of normalized) {
    const current = byModality.get(row.modality) ?? { modality: row.modality, records: 0, priceRegistrationTotal: 0, purchasedAmount: 0, estimatedAmount: 0, items: 0 };
    current.records += 1;
    current.priceRegistrationTotal += row.priceRegistrationTotal;
    current.purchasedAmount += row.purchasedAmount;
    current.estimatedAmount += row.estimatedAmount;
    current.items += row.items;
    byModality.set(row.modality, current);
  }
  const fromDetails = {
    priceRegistrationTotal: sum(normalized.map((row) => row.priceRegistrationTotal)),
    purchasedAmount: sum(normalized.map((row) => row.purchasedAmount)),
    estimatedAmount: sum(normalized.map((row) => row.estimatedAmount)),
    items: sum(normalized.map((row) => row.items)),
  };
  const totals = totalRow ? {
    priceRegistrationTotal: numberField(totalRow['Total registro de preço'], 'TOTAL.Total registro de preço'),
    purchasedAmount: numberField(totalRow['Valor comprado'], 'TOTAL.Valor comprado'),
    estimatedAmount: numberField(totalRow['Valor estimado'], 'TOTAL.Valor estimado'),
    items: numberField(totalRow.Itens, 'TOTAL.Itens'),
  } : fromDetails;

  return {
    records: detailRows.length,
    totals: { ...totals, priceRegistrationTotal: roundCurrency(totals.priceRegistrationTotal), purchasedAmount: roundCurrency(totals.purchasedAmount), estimatedAmount: roundCurrency(totals.estimatedAmount) },
    modalities: [...byModality.values()].map((item) => ({ ...item, priceRegistrationTotal: roundCurrency(item.priceRegistrationTotal), purchasedAmount: roundCurrency(item.purchasedAmount), estimatedAmount: roundCurrency(item.estimatedAmount) })).sort((a, b) => b.purchasedAmount - a.purchasedAmount),
  };
}
