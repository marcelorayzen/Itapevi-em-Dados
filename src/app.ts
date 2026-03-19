import express from 'express';
import { healthCheck } from './health';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get('/health', (req: express.Request, res: express.Response) => {
  return res.json(healthCheck());
});

export function listenHttp() {
  app.listen(port, () => {
    console.log(`HTTP health server rodando em http://localhost:${port}/health`);
  });
}

export default app;
