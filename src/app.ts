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

function demoPage(): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Itapevi em Dados - Demonstracao local</title>
  <style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem;color:#14213d}section{border:1px solid #d9e2ec;border-radius:8px;padding:1rem;margin:1rem 0}small{color:#52606d}.warning{color:#9c3d00}pre{white-space:pre-wrap;background:#f5f7fa;padding:1rem;overflow:auto}</style></head>
  <body><h1>Itapevi em Dados</h1><p>Demonstracao local e somente leitura. Nao e um portal publico.</p>
  <section><h2>Catalogo de datasets</h2><div id="catalog">Carregando…</div></section>
  <section><h2>Entidades e evidencias</h2><div id="entities">Carregando…</div></section>
  <section><h2>Limites da demonstracao</h2><p class="warning">Dados piloto. Sempre confira fonte, cobertura, termos e estado de revisao antes de usar qualquer resultado.</p></section>
  <script>const esc=(v)=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  async function load(url,id,render){const el=document.getElementById(id);try{const r=await fetch(url);const x=await r.json();if(!r.ok)throw new Error(x.limitations?.join(' ')||'Falha');el.innerHTML=render(x)+'<small>Cobertura: '+esc(x.coverage.scope)+' · Confianca: '+esc(x.confidence)+'</small>'}catch(e){el.innerHTML='<p class="warning">'+esc(e.message)+'</p>'}}
  load('/api/demo/catalog','catalog',x=>x.data.datasets.map(d=>'<article><h3>'+esc(d.name)+'</h3><p>'+esc(d.scope)+'</p><p>Fonte: '+esc(d.source.organization)+' | Termos: '+esc(d.source.redistributionStatus)+' | Artefatos: '+esc(d.artifacts.count)+'</p></article>').join('')||'<p>Nenhum dataset.</p>');
  load('/api/demo/entities','entities',x=>x.data.entities.map(e=>'<article><h3>'+esc(e.canonicalName||e.aliasText)+'</h3><p>Alias: '+esc(e.aliasText)+' | Estado: '+esc(e.resolutionStatus)+' | Pagina: '+esc(e.locator.page)+'</p><p>Dataset: '+esc(e.datasetName)+'</p></article>').join('')||'<p>Nenhuma entidade.</p>');</script></body></html>`;
}

const app = createApp();

export function listenHttp() {
  app.listen(port, () => {
    console.log(`HTTP health server rodando em http://localhost:${port}/health`);
  });
}

export default app;
