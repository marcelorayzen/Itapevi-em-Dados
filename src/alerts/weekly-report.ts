import { createCommonResponse, type CommonResponse, type EvidenceReference } from '../contracts/response.js';

export type WeeklyAlertCategory = 'new_collection' | 'processing_failure' | 'terms_review' | 'entity_review';
export type WeeklyAlertSeverity = 'info' | 'attention';

export interface WeeklyAlert {
  category: WeeklyAlertCategory;
  severity: WeeklyAlertSeverity;
  summary: string;
  evidence: EvidenceReference[];
}

export interface WeeklyAlertSnapshot {
  newArtifacts: Array<{ datasetId: string; datasetName: string; sourceId: string; sourceUrl: string; sha256: string; collectedAt: string }>;
  failedRuns: Array<{ runId: string; datasetId: string; sourceId: string; sourceUrl: string; sha256: string; processorName: string; finishedAt: string }>;
  pendingTerms: Array<{ sourceId: string; datasetId: string; organization: string; sourceUrl: string }>;
  pendingEntities: Array<{ datasetId: string; sourceId: string; sourceUrl: string; sha256: string; count: number }>;
}

function uniqueEvidence(alerts: WeeklyAlert[]): EvidenceReference[] {
  const seen = new Set<string>();
  return alerts.flatMap((alert) => alert.evidence).filter((item) => {
    const key = `${item.sourceId}|${item.datasetId}|${item.artifactSha256 ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function createWeeklyAlertReport(snapshot: WeeklyAlertSnapshot, asOf = new Date().toISOString()): CommonResponse<{ audience: string[]; dispatch: string; alerts: WeeklyAlert[]; notEvaluated: string[] }> {
  const alerts: WeeklyAlert[] = [
    ...snapshot.newArtifacts.map((item) => ({
      category: 'new_collection' as const, severity: 'info' as const,
      summary: `Nova coleta registrada para ${item.datasetName} em ${item.collectedAt}.`,
      evidence: [{ sourceId: item.sourceId, datasetId: item.datasetId, sourceUrl: item.sourceUrl, artifactSha256: item.sha256, collectedAt: item.collectedAt }],
    })),
    ...snapshot.failedRuns.map((item) => ({
      category: 'processing_failure' as const, severity: 'attention' as const,
      summary: `Processamento ${item.processorName} falhou em ${item.finishedAt}; revisar a execução ${item.runId}.`,
      evidence: [{ sourceId: item.sourceId, datasetId: item.datasetId, sourceUrl: item.sourceUrl, artifactSha256: item.sha256 }],
    })),
    ...snapshot.pendingTerms.map((item) => ({
      category: 'terms_review' as const, severity: 'attention' as const,
      summary: `A fonte ${item.organization} continua com termos de redistribuição pendentes de revisão.`,
      evidence: [{ sourceId: item.sourceId, datasetId: item.datasetId, sourceUrl: item.sourceUrl }],
    })),
    ...snapshot.pendingEntities.map((item) => ({
      category: 'entity_review' as const, severity: 'attention' as const,
      summary: `${item.count} alias(es) de entidade aguardam revisão humana.`,
      evidence: [{ sourceId: item.sourceId, datasetId: item.datasetId, sourceUrl: item.sourceUrl, artifactSha256: item.sha256 }],
    })),
  ];
  const evidence = uniqueEvidence(alerts);
  return createCommonResponse({
    status: evidence.length > 0 ? 'ok' : 'partial',
    data: {
      audience: ['Marcelo Augusto', 'Rayzen'], dispatch: 'relatorio local sob demanda; sem envio externo automatico', alerts,
      notEvaluated: ['Mudancas de schema: exigem baseline versionado por fonte.', 'Variacoes comparativas: exigem ao menos dois recortes equivalentes por indicador.'],
    },
    evidence,
    coverage: { scope: 'coletas, execucoes, termos e aliases registrados no PostgreSQL local nos ultimos sete dias', status: 'pilot', asOf },
    limitations: ['Nao monitora portais continuamente.', 'Nao envia notificacoes externas.', 'Alertas descrevem estado operacional ou pendencia de governanca; nao classificam conduta.'],
    confidence: 'needs_review', metadata: { municipality: 'Itapevi', generatedAt: asOf },
  });
}
