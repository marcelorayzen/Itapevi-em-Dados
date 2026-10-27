export interface LoaCandidate {
  type: 'municipal_budget_law';
  status: 'candidate';
  lawNumber: string;
  lawDate: string;
  exercise: number;
  title: string;
  totals: {
    overall: number;
    fiscal: number;
    socialSecurity: number;
  };
  evidence: Array<{
    locator: string;
    purpose: 'identity' | 'exercise' | 'overall_total' | 'fiscal_total' | 'social_security_total';
  }>;
}

const MONTHS: Record<string, number> = {
  JANEIRO: 1,
  FEVEREIRO: 2,
  MARÇO: 3,
  MARCO: 3,
  ABRIL: 4,
  MAIO: 5,
  JUNHO: 6,
  JULHO: 7,
  AGOSTO: 8,
  SETEMBRO: 9,
  OUTUBRO: 10,
  NOVEMBRO: 11,
  DEZEMBRO: 12,
};

function requiredMatch(markdown: string, expression: RegExp, field: string): RegExpMatchArray {
  const match = markdown.match(expression);
  if (!match) {
    throw new Error(`Não foi possível extrair ${field} da LOA.`);
  }
  return match;
}

export function parseBrazilianCurrency(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Valor monetário inválido: ${value}`);
  }
  return parsed;
}

export function normalizeLoaMarkdown(markdown: string): LoaCandidate {
  const law = requiredMatch(
    markdown,
    /LEI\s+N[º°o.]?\s*([\d.]+),\s*DE\s*(\d{1,2})\s+DE\s+([\p{L}]+)\s+DE\s+(\d{4})/iu,
    'número e data da lei',
  );
  const month = MONTHS[law[3].toLocaleUpperCase('pt-BR')];
  if (!month) {
    throw new Error(`Mês inválido na data da lei: ${law[3]}`);
  }

  const exercise = Number(requiredMatch(markdown, /EXERC[ÍI]CIO\s+(?:FINANCEIRO\s+DE\s+)?(\d{4})/iu, 'exercício')[1]);
  const title = requiredMatch(markdown, /"([^"]*ESTIMA\s+A\s+RECEITA[^"]*)"/iu, 'título')[1]
    .replace(/\s+/g, ' ')
    .trim();
  const overall = parseBrazilianCurrency(
    requiredMatch(markdown, /em\s+R\$\s*([\d.]+,\d{2})/iu, 'total orçamentário')[1],
  );
  const fiscal = parseBrazilianCurrency(
    requiredMatch(markdown, /I\s*-\s*R\$\s*([\d.]+,\d{2}).{0,240}?OR[ÇC]AMENTO\s+FISCAL/isu, 'orçamento fiscal')[1],
  );
  const socialSecurity = parseBrazilianCurrency(
    requiredMatch(markdown, /II\s*-\s*R\$\s*([\d.]+,\d{2}).{0,240}?OR[ÇC]AMENTO\s+DA\s+SEGURIDADE\s+SOCIAL/isu, 'orçamento da seguridade social')[1],
  );

  return {
    type: 'municipal_budget_law',
    status: 'candidate',
    lawNumber: law[1],
    lawDate: `${law[4]}-${String(month).padStart(2, '0')}-${law[2].padStart(2, '0')}`,
    exercise,
    title,
    totals: { overall, fiscal, socialSecurity },
    evidence: [
      { locator: 'lei_header', purpose: 'identity' },
      { locator: 'artigo_1', purpose: 'exercise' },
      { locator: 'artigo_2', purpose: 'overall_total' },
      { locator: 'artigo_2_inciso_1', purpose: 'fiscal_total' },
      { locator: 'artigo_2_inciso_2', purpose: 'social_security_total' },
    ],
  };
}
