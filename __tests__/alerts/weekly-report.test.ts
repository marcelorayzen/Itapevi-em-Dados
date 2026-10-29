import { createWeeklyAlertReport } from '../../src/alerts/weekly-report';

describe('relatorio semanal de alertas', () => {
  it('gera alertas auditaveis sem disparo externo e declara o que nao avalia', () => {
    const report = createWeeklyAlertReport({
      newArtifacts: [{ datasetId: 'DS-1', datasetName: 'Compras', sourceId: 'SRC-1', sourceUrl: 'https://fonte.test', sha256: 'A'.repeat(64), collectedAt: '2026-10-28T10:00:00.000Z' }],
      failedRuns: [{ runId: 'run-1', datasetId: 'DS-1', sourceId: 'SRC-1', sourceUrl: 'https://fonte.test', sha256: 'A'.repeat(64), processorName: 'normalizador', finishedAt: '2026-10-28T11:00:00.000Z' }],
      pendingTerms: [{ sourceId: 'SRC-1', datasetId: 'DS-1', organization: 'Fonte teste', sourceUrl: 'https://fonte.test' }],
      pendingEntities: [{ datasetId: 'DS-1', sourceId: 'SRC-1', sourceUrl: 'https://fonte.test', sha256: 'A'.repeat(64), count: 2 }],
    }, '2026-10-29T00:00:00.000Z');

    expect(report.status).toBe('ok');
    expect(report.data.audience).toEqual(['Marcelo Augusto', 'Rayzen']);
    expect(report.data.dispatch).toContain('sem envio externo automatico');
    expect(report.data.alerts.map((item) => item.category)).toEqual(['new_collection', 'processing_failure', 'terms_review', 'entity_review']);
    expect(report.data.notEvaluated).toHaveLength(2);
    expect(report.evidence).toHaveLength(2);
  });
});
