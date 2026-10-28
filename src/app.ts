import express from 'express';
import { createCommonResponse } from './contracts/response.js';
import { healthCheck } from './health';
import { createPostgresDemoDataProvider, type DemoDataProvider } from './web/demo-data.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createApp(provider: DemoDataProvider = createPostgresDemoDataProvider()) {
  const app = express();
  app.get('/health', (_req: express.Request, res: express.Response) => res.json(healthCheck()));

  app.get('/', (_req: express.Request, res: express.Response) => {
  return res.type('html').send(`<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8"><title>Itapevi em Dados - Diagnóstico local</title></head>
  <body>
    <main>
      <h1>Itapevi em Dados</h1>
      <p>Diagnóstico local do protótipo. Isto não é o portal público.</p>
      <p><a href="/demo">Abrir demonstracao local</a> · <a href="/health">Verificar health-check em JSON</a></p>
    </main>
  </body>
</html>`);
  });

  app.get('/api/demo/catalog', async (_req, res) => {
    try { return res.json(await provider.getCatalog()); }
    catch (error: unknown) { return res.status(503).json(demoError('catalogo', error)); }
  });
  app.get('/api/demo/entities', async (_req, res) => {
    try { return res.json(await provider.getEntities()); }
    catch (error: unknown) { return res.status(503).json(demoError('entidades', error)); }
  });
  app.get('/api/demo/budget', async (_req, res) => {
    try { return res.json(await provider.getBudgetSummary()); }
    catch (error: unknown) { return res.status(503).json(demoError('resumo orcamentario', error)); }
  });
  app.get('/api/demo/demographics', async (_req, res) => {
    try { return res.json(await provider.getDemographics()); }
    catch (error: unknown) { return res.status(503).json(demoError('estimativa demografica', error)); }
  });
  app.get('/api/demo/historical-expenses', async (_req, res) => {
    try { return res.json(await provider.getHistoricalExpenses()); }
    catch (error: unknown) { return res.status(503).json(demoError('despesas historicas', error)); }
  });
  app.get('/api/demo/procurement', async (_req, res) => {
    try { return res.json(await provider.getProcurementSummary()); }
    catch (error: unknown) { return res.status(503).json(demoError('compras por modalidade', error)); }
  });
  app.get('/api/demo/query', async (req, res) => {
    try { return res.json(await answerQuestion(String(req.query.q ?? ''), provider)); }
    catch (error: unknown) { return res.status(503).json(demoError('consulta guiada', error)); }
  });
  app.get('/demo', (_req, res) => res.type('html').send(demoPage()));
  return app;
}

function demoError(area: string, error: unknown) {
  return createCommonResponse({
    status: 'error', data: { area }, evidence: [], coverage: { scope: 'demonstracao local', status: 'unknown' },
    limitations: [`Nao foi possivel carregar ${area}.`, error instanceof Error ? error.message : 'Erro desconhecido.'],
    confidence: 'low', metadata: { municipality: 'Itapevi' },
  });
}

export async function answerQuestion(question: string, provider: DemoDataProvider) {
  const normalized = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (['irregular', 'fraude', 'favorec', 'culpa', 'corrup', 'desvio', 'crime', 'ilegal'].some((term) => normalized.includes(term))) {
    return createCommonResponse({
      status: 'not_found',
      data: { question, answer: 'Esta demonstracao nao classifica pessoas, empresas, contratos ou orgaos como irregulares, fraudulentos, favorecidos ou culpados. Posso apresentar somente fatos verificaveis, com fonte, periodo, criterio e limitacoes de cobertura.' },
      evidence: [],
      coverage: { scope: 'proteção ADR-011 para consultas guiadas locais', status: 'pilot' },
      limitations: ['Indicadores descritivos nao comprovam conduta, ilegalidade ou responsabilidade.', 'Qualquer analise sensivel exige contexto, fonte verificavel e revisao humana.'],
      confidence: 'high', metadata: { municipality: 'Itapevi' },
    });
  }
  if (normalized.includes('populacao') || normalized.includes('habitantes')) {
    const response = await provider.getDemographics(); const estimate = (response.data.estimates[0] ?? {}) as { estimated_population?: number; reference_date?: string };
    return { ...response, data: { question, answer: estimate.estimated_population ? `A estimativa oficial do IBGE para Itapevi e ${estimate.estimated_population.toLocaleString('pt-BR')} habitantes, com referencia em ${estimate.reference_date}.` : 'Nao ha estimativa carregada.' } };
  }
  if (normalized.includes('execucao') || normalized.includes('executado') || normalized.includes('realizado por orgao') || normalized.includes('realizado por programa')) {
    const response = await provider.getBudgetSummary();
    const item = (response.data.exports[0] ?? {}) as { totals?: { plannedAmount: number; realizedAmount: number }; breakdown?: Array<{ program: string; responsibleBody: string; plannedAmount: number; realizedAmount: number }> };
    const totalRate = item.totals && item.totals.plannedAmount > 0 ? (item.totals.realizedAmount / item.totals.plannedAmount) * 100 : 0;
    const top = [...(item.breakdown ?? [])].filter((row) => row.plannedAmount > 0).sort((a, b) => (b.realizedAmount / b.plannedAmount) - (a.realizedAmount / a.plannedAmount))[0];
    const detail = top ? ` O maior percentual entre as linhas retornadas foi ${top.responsibleBody} / ${top.program}: ${((top.realizedAmount / top.plannedAmount) * 100).toFixed(2)}%.` : '';
    return { ...response, data: { question, answer: `No recorte carregado, a execucao agregada e ${totalRate.toFixed(2)}% do previsto.${detail} O resultado descreve somente as linhas e o periodo exportados.` } };
  }
  if (normalized.includes('previsto') || normalized.includes('empenhado') || normalized.includes('orcamento')) {
    const response = await provider.getBudgetSummary(); const item = (response.data.exports[0] ?? {}) as { totals?: { plannedAmount: number; realizedAmount: number }; filters?: Record<string, string> };
    return { ...response, data: { question, answer: item.totals ? `No recorte ${item.filters?.['Data Inicial']} a ${item.filters?.['Data Final']}, o painel LAI retornou R$ ${item.totals.plannedAmount.toLocaleString('pt-BR',{minimumFractionDigits:2})} previstos e R$ ${item.totals.realizedAmount.toLocaleString('pt-BR',{minimumFractionDigits:2})} realizados.` : 'Nao ha exportacao LAI carregada.' } };
  }
  if (normalized.includes('licitac') || normalized.includes('compra') || normalized.includes('modalidade')) {
    const response = await provider.getProcurementSummary();
    const item = (response.data.exports[0] ?? {}) as { records?: number; totals?: { purchasedAmount: number; estimatedAmount: number }; modalities?: Array<{ modality: string; purchasedAmount: number }> };
    const top = [...(item.modalities ?? [])].sort((a, b) => b.purchasedAmount - a.purchasedAmount)[0];
    const values = item.totals;
    return { ...response, data: { question, answer: values ? `A exportacao local resume ${item.records} registros de compras, com R$ ${values.purchasedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em valor comprado e R$ ${values.estimatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em valor estimado.${top ? ` A modalidade com maior valor comprado no recorte foi ${top.modality}, com R$ ${top.purchasedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.` : ''} Isto descreve somente o arquivo exportado.` : 'Nao ha exportacao de compras carregada.' } };
  }
  if ((normalized.includes('tcesp') || normalized.includes('historico') || normalized.includes('2019')) && !normalized.includes('maior') && !normalized.includes('mais')) {
    const response = await provider.getHistoricalExpenses(); const item = (response.data.periods[0] ?? {}) as { period?: string; recordCount?: number; groups?: number };
    return { ...response, data: { question, answer: item.period ? `O piloto TCESP cobre ${item.period}, com ${item.recordCount} registros brutos locais agregados em ${item.groups} grupos.` : 'Nao ha piloto TCESP carregado.' } };
  }
  if ((normalized.includes('maior') || normalized.includes('mais')) && (normalized.includes('despesa') || normalized.includes('gasto') || normalized.includes('orgao'))) {
    const response = await provider.getHistoricalExpenses();
    const item = (response.data.periods[0] ?? {}) as { period?: string; aggregate?: Array<{ orgao: string; evento: string; total: number }> };
    const top = [...(item.aggregate ?? [])].sort((a, b) => b.total - a.total)[0];
    return { ...response, data: { question, answer: top ? `No recorte ${item.period}, o maior grupo agregado foi ${top.orgao} / ${top.evento}, com R$ ${top.total.toLocaleString('pt-BR',{minimumFractionDigits:2})}. Isso descreve somente o mes coletado.` : 'Nao ha grupo TCESP carregado.' } };
  }
  if (normalized.includes('entidade') || normalized.includes('secretaria') || normalized.includes('revisao')) {
    const response = await provider.getEntities(); const items = response.data.entities as Array<{ canonicalName?: string | null; resolutionStatus?: string }>;
    const pending = items.filter((item) => item.resolutionStatus === 'needs_review').length;
    return { ...response, data: { question, answer: `Ha ${items.length} aliases de entidades carregados; ${pending} permanecem em revisao e nao foram unidos automaticamente.` } };
  }
  return createCommonResponse({ status: 'not_found', data: { question, answer: 'Ainda nao tenho uma consulta verificavel para essa pergunta. Tente populacao, previsto/empenhado, compras por modalidade, TCESP 2019 ou entidades.' }, evidence: [], coverage: { scope: 'consultas guiadas locais', status: 'pilot' }, limitations: ['A demonstracao responde somente perguntas suportadas por dados carregados e evidenciados.'], confidence: 'low', metadata: { municipality: 'Itapevi' } });
}

function demoPage(): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Itapevi em Dados</title><style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem;color:#14213d}section{border:1px solid #d9e2ec;border-radius:8px;padding:1rem;margin:1rem 0}small{color:#52606d}.warning{color:#9c3d00}input{padding:.7rem;width:70%}button{padding:.7rem}</style></head><body><h1>Itapevi em Dados</h1><p>Demonstracao local e somente leitura. Nao e um portal publico.</p><section><h2>Pergunte aos dados carregados</h2><input id="q" placeholder="Ex.: Qual a populacao? Quanto foi previsto? Compras por modalidade"><button onclick="ask()">Perguntar</button><div id="answer"></div><small>Consultas disponiveis: populacao, previsto/empenhado, compras por modalidade, TCESP 2019 e entidades.</small></section><section><h2>Catalogo de datasets</h2><div id="catalog">Carregando...</div></section><section><h2>Estimativa populacional</h2><div id="demographics">Carregando...</div></section><section><h2>Entidades e evidencias</h2><div id="entities">Carregando...</div></section><section><h2>Previsto e empenhado</h2><div id="budget">Carregando...</div></section><section><h2>Compras por modalidade</h2><div id="procurement">Carregando...</div></section><section><h2>Despesas historicas agregadas</h2><div id="historical">Carregando...</div></section><section><h2>Limites</h2><p class="warning">Dados piloto. Confira fonte, cobertura, termos e estado de revisao.</p></section><script>const esc=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));async function load(u,id,r){const e=document.getElementById(id);try{const x=await (await fetch(u)).json();e.innerHTML=r(x)+'<small>Cobertura: '+esc(x.coverage.scope)+' | Confianca: '+esc(x.confidence)+'</small>'}catch(err){e.innerHTML='<p class="warning">'+esc(err.message)+'</p>'}}async function ask(){const e=document.getElementById('answer'),q=document.getElementById('q').value;e.innerHTML='Consultando...';const x=await (await fetch('/api/demo/query?q='+encodeURIComponent(q))).json();e.innerHTML='<p><strong>'+esc(x.data.answer)+'</strong></p><small>Cobertura: '+esc(x.coverage.scope)+' | Confianca: '+esc(x.confidence)+'</small>'}load('/api/demo/catalog','catalog',x=>x.data.datasets.map(d=>'<article><h3>'+esc(d.name)+'</h3><p>'+esc(d.scope)+'</p><p>Fonte: '+esc(d.source.organization)+' | Termos: '+esc(d.source.redistributionStatus)+'</p></article>').join(''));load('/api/demo/demographics','demographics',x=>x.data.estimates.map(e=>'<p><strong>'+Number(e.estimated_population).toLocaleString('pt-BR')+' habitantes</strong> | '+esc(e.reference_date)+'</p>').join(''));load('/api/demo/entities','entities',x=>x.data.entities.map(e=>'<p>'+esc(e.canonicalName||e.aliasText)+' | '+esc(e.resolutionStatus)+'</p>').join(''));load('/api/demo/budget','budget',x=>x.data.exports.map(e=>'<p>'+esc(e.filters['Data Inicial'])+' a '+esc(e.filters['Data Final'])+' | R$ '+Number(e.totals.plannedAmount).toLocaleString('pt-BR',{minimumFractionDigits:2})+' previsto</p>').join(''));load('/api/demo/procurement','procurement',x=>x.data.exports.map(e=>'<p>'+esc(e.records)+' registros | R$ '+Number(e.totals.purchasedAmount).toLocaleString('pt-BR',{minimumFractionDigits:2})+' comprado | '+esc(e.modalities.length)+' modalidades</p>').join(''));load('/api/demo/historical-expenses','historical',x=>x.data.periods.map(p=>'<p>'+esc(p.period)+' | '+esc(p.recordCount)+' registros | '+esc(p.groups)+' grupos</p>').join(''));</script></body></html>`;
}

const app = createApp();

export function listenHttp() {
  app.listen(port, () => {
    console.log(`HTTP health server rodando em http://localhost:${port}/health`);
  });
}

export default app;
