import express from 'express';
import { healthCheck } from './health';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get('/health', (req: express.Request, res: express.Response) => {
  return res.json(healthCheck());
});

app.get('/', (_req: express.Request, res: express.Response) => {
  return res.type('html').send(`<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8"><title>Itapevi em Dados - Diagnóstico local</title></head>
  <body>
    <main>
      <h1>Itapevi em Dados</h1>
      <p>Diagnóstico local do protótipo. Isto não é o portal público.</p>
      <p><a href="/health">Verificar health-check em JSON</a></p>
    </main>
  </body>
</html>`);
});

export function listenHttp() {
  app.listen(port, () => {
    console.log(`HTTP health server rodando em http://localhost:${port}/health`);
  });
}

export default app;
