import { summarizeNaturalLanguageEvaluation, type NaturalLanguageEvaluationCase } from '../../src/evaluation/natural-language-evaluation.js';

function cases(count: number, overrides: Partial<NaturalLanguageEvaluationCase> = {}): NaturalLanguageEvaluationCase[] {
  return Array.from({ length: count }, (_, index) => ({
    caseId: `Q-${index + 1}`,
    profile: 'cidadao',
    question: `pergunta ${index + 1}`,
    expectedOutcome: 'factual',
    observedOutcome: 'factual',
    evidencePresent: true,
    verdict: 'correct',
    ...overrides,
  }));
}

describe('summarizeNaturalLanguageEvaluation', () => {
  it('aceita avaliacao com 40 casos, 90% adequados e evidencias em todos os fatos', () => {
    const result = summarizeNaturalLanguageEvaluation([
      ...cases(36),
      ...cases(4, { verdict: 'failure' }).map((item, index) => ({ ...item, caseId: `F-${index + 1}` })),
    ]);
    expect(result.targetMet).toBe(true);
    expect(result.acceptedRate).toBe(0.9);
    expect(result.factualWithoutEvidence).toBe(0);
  });

  it('reprova fatos sem evidencia ou menos de 40 casos', () => {
    const missingEvidence = summarizeNaturalLanguageEvaluation(cases(40, { evidencePresent: false }));
    const incomplete = summarizeNaturalLanguageEvaluation(cases(39));
    expect(missingEvidence.targetMet).toBe(false);
    expect(incomplete.targetMet).toBe(false);
  });
});
