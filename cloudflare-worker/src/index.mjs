const MUNICIPALITY_CODE = '3522505';
const POPULATION_INDICATOR = '29171';
const IBGE_POPULATION_URL = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/${POPULATION_INDICATOR}/resultados/${MUNICIPALITY_CODE}`;
const PORTAL_ORIGIN = 'https://itapevi-em-dados.rayzen.com.br';

function response(body, status = 200, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=900',
      'access-control-allow-origin': origin === PORTAL_ORIGIN ? origin : PORTAL_ORIGIN,
      'vary': 'Origin',
    },
  });
}

function normalized(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function latestPopulation(payload) {
  const series = payload?.[0]?.res?.[0]?.res ?? {};
  const years = Object.keys(series).filter((year) => /^\d{4}$/.test(year)).sort((a, b) => Number(a) - Number(b));
  const year = years.at(-1);
  const population = year ? Number(series[year]) : Number.NaN;
  if (!year || !Number.isFinite(population) || population <= 0) throw new Error('A serie retornada pelo IBGE nao possui uma estimativa valida.');
  return { year, population };
}

export async function answerQuestion(question, fetchImpl = fetch, collectedAt = new Date().toISOString()) {
  const query = normalized(question);
  const isPopulationQuestion = ['populacao', 'habitante', 'demograf'].some((term) => query.includes(term));

  if (!isPopulationQuestion) {
    return {
      status: 'not_available',
      question,
      answer: 'Ainda nao ha um dado publico governado para responder a esta pergunta. O portal nao infere nem inventa informacoes: publiquei inicialmente a estimativa populacional do IBGE e vou ampliar o catalogo com execucao orcamentaria e compras apos revisao das fontes.',
      evidence: [],
      coverage: { scope: 'catalogo publico inicial: estimativa populacional de Itapevi', status: 'partial' },
      limitations: ['Perguntas sobre orcamento, compras, contratos, empresas ou pessoas ainda nao possuem dataset publico aprovado nesta API.', 'Uma ausencia de resposta nao e uma conclusao sobre os fatos solicitados.'],
      confidence: 'high',
      metadata: { municipality: 'Itapevi', mode: 'deterministic-question-routing' },
    };
  }

  const source = await fetchImpl(IBGE_POPULATION_URL, { headers: { accept: 'application/json' } });
  if (!source.ok) throw new Error(`IBGE respondeu HTTP ${source.status}.`);
  const { year, population } = latestPopulation(await source.json());

  return {
    status: 'ok',
    question,
    answer: `A estimativa populacional de Itapevi para ${year}, segundo o IBGE, e de ${population.toLocaleString('pt-BR')} habitantes.`,
    data: { indicator: 'estimativa_populacional', municipality: 'Itapevi', municipalityCode: MUNICIPALITY_CODE, year, population },
    evidence: [{ source: 'Instituto Brasileiro de Geografia e Estatistica (IBGE)', indicator: POPULATION_INDICATOR, url: IBGE_POPULATION_URL, collectedAt }],
    coverage: { scope: 'estimativa populacional municipal de Itapevi; ultimo ano retornado pelo indicador 29171', status: 'official_source' },
    limitations: ['A estimativa populacional nao informa gasto publico, qualidade de servicos, area territorial, densidade ou PIB.', 'O numero deve ser lido junto do ano de referencia informado.'],
    confidence: 'high',
    metadata: { municipality: 'Itapevi', mode: 'deterministic-question-routing', version: '1.0' },
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': origin === PORTAL_ORIGIN ? origin : PORTAL_ORIGIN,
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'access-control-max-age': '86400',
          'vary': 'Origin',
        },
      });
    }

    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return response({ status: 'ok', service: 'itapevi-em-dados-public-api', catalog: ['ibge_population'] }, 200, origin);
    }
    if (url.pathname !== '/v1/ask' || request.method !== 'POST') {
      return response({ status: 'not_found', message: 'Use POST /v1/ask ou GET /health.' }, 404, origin);
    }

    try {
      const body = await request.json();
      const question = typeof body?.question === 'string' ? body.question.trim() : '';
      if (question.length < 3 || question.length > 500) {
        return response({ status: 'invalid_request', message: 'Envie uma pergunta entre 3 e 500 caracteres.' }, 400, origin);
      }
      return response(await answerQuestion(question), 200, origin);
    } catch (error) {
      return response({
        status: 'unavailable',
        message: 'Nao foi possivel consultar a fonte oficial neste momento. Tente novamente mais tarde.',
        limitations: [error instanceof Error ? error.message : 'Erro desconhecido.'],
      }, 503, origin);
    }
  },
};

