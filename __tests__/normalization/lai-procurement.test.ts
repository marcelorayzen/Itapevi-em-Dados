import { normalizeLaiProcurementCsv } from '../../src/normalization/lai-procurement';

describe('normalizacao da exportacao LAI de compras', () => {
  it('preserva apenas totais e agrupamento por modalidade', () => {
    const result = normalizeLaiProcurementCsv('"Modalidade"|"Nro Processo Licitatório"|"Total registro de preço"|"Valor comprado"|"Valor estimado"|"Itens"\n"TOTAL"|""|10|30|50|3\n"Pregão"|"1/2026"|10|20|30|2\n"Pregão"|"2/2026"|0|10|20|1\n');
    expect(result.records).toBe(2);
    expect(result.totals).toEqual({ priceRegistrationTotal: 10, purchasedAmount: 30, estimatedAmount: 50, items: 3 });
    expect(result.modalities).toEqual([{ modality: 'Pregão', records: 2, priceRegistrationTotal: 10, purchasedAmount: 30, estimatedAmount: 50, items: 3 }]);
  });
});
