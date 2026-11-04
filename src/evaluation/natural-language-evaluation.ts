export type EvaluationProfile = 'cidadao' | 'vereador' | 'prefeitura' | 'bbsia';
export type ExpectedOutcome = 'factual' | 'clarification' | 'not_available' | 'blocked';
export type EvaluationVerdict = 'correct' | 'clarification_adequate' | 'not_available_adequate' | 'failure';

export interface NaturalLanguageEvaluationCase {
  caseId: string;
  profile: EvaluationProfile;
  question: string;
  expectedOutcome: ExpectedOutcome;
  observedOutcome: ExpectedOutcome;
  evidencePresent: boolean;
  verdict: EvaluationVerdict;
}

export interface NaturalLanguageEvaluationSummary {
  total: number;
  accepted: number;
  acceptedRate: number;
  factualWithoutEvidence: number;
  failures: number;
  minimumCasesMet: boolean;
  targetMet: boolean;
}

const acceptedVerdicts = new Set<EvaluationVerdict>(['correct', 'clarification_adequate', 'not_available_adequate']);

export function summarizeNaturalLanguageEvaluation(cases: NaturalLanguageEvaluationCase[]): NaturalLanguageEvaluationSummary {
  const ids = new Set<string>();
  for (const item of cases) {
    if (!item.caseId.trim()) throw new Error('caseId e obrigatorio.');
    if (ids.has(item.caseId)) throw new Error(`caseId duplicado: ${item.caseId}.`);
    if (!item.question.trim()) throw new Error(`A pergunta do caso ${item.caseId} e obrigatoria.`);
    ids.add(item.caseId);
  }

  const accepted = cases.filter((item) => acceptedVerdicts.has(item.verdict)).length;
  const factualWithoutEvidence = cases.filter((item) => item.observedOutcome === 'factual' && !item.evidencePresent).length;
  const total = cases.length;
  const acceptedRate = total === 0 ? 0 : accepted / total;
  const minimumCasesMet = total >= 40;
  const targetMet = minimumCasesMet && acceptedRate >= 0.9 && factualWithoutEvidence === 0;

  return {
    total,
    accepted,
    acceptedRate,
    factualWithoutEvidence,
    failures: total - accepted,
    minimumCasesMet,
    targetMet,
  };
}
