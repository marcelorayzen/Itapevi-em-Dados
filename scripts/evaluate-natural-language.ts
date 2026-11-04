import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { summarizeNaturalLanguageEvaluation, type EvaluationProfile, type EvaluationVerdict, type ExpectedOutcome, type NaturalLanguageEvaluationCase } from '../src/evaluation/natural-language-evaluation.js';

const profiles = new Set<EvaluationProfile>(['cidadao', 'vereador', 'prefeitura', 'bbsia']);
const outcomes = new Set<ExpectedOutcome>(['factual', 'clarification', 'not_available', 'blocked']);
const verdicts = new Set<EvaluationVerdict>(['correct', 'clarification_adequate', 'not_available_adequate', 'failure']);

function inputPath(): string {
  const index = process.argv.indexOf('--input');
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error('Informe --input com o CSV local anonimizado.');
  return value;
}

function asBoolean(value: unknown, field: string, caseId: string): boolean {
  if (value === 'sim') return true;
  if (value === 'nao') return false;
  throw new Error(`${field} do caso ${caseId} deve ser sim ou nao.`);
}

function asMember<T extends string>(value: unknown, allowed: Set<T>, field: string, caseId: string): T {
  if (typeof value === 'string' && allowed.has(value as T)) return value as T;
  throw new Error(`${field} do caso ${caseId} nao possui valor permitido.`);
}

async function main(): Promise<void> {
  const input = inputPath();
  const content = await readFile(input, 'utf8');
  const rows = parse(content, { columns: true, skip_empty_lines: true, bom: true, delimiter: ';', trim: true }) as Array<Record<string, string>>;
  const cases: NaturalLanguageEvaluationCase[] = rows.map((row) => {
    const caseId = row.case_id ?? '';
    return {
      caseId,
      profile: asMember(row.profile, profiles, 'profile', caseId),
      question: row.question ?? '',
      expectedOutcome: asMember(row.expected_outcome, outcomes, 'expected_outcome', caseId),
      observedOutcome: asMember(row.observed_outcome, outcomes, 'observed_outcome', caseId),
      evidencePresent: asBoolean(row.evidence_present, 'evidence_present', caseId),
      verdict: asMember(row.verdict, verdicts, 'verdict', caseId),
    };
  });
  console.log(JSON.stringify(summarizeNaturalLanguageEvaluation(cases), null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
