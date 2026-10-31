import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from '../src/index.mjs';

const ibgePayload = [{ res: [{ res: { '2025': '240961', '2026': '243967' } }] }];

test('responde populacao com evidencia oficial', async () => {
  const response = await answerQuestion('Qual a populacao de Itapevi?', async () => new Response(JSON.stringify(ibgePayload)));
  assert.equal(response.status, 'ok');
  assert.equal(response.data.population, 243967);
  assert.equal(response.data.year, '2026');
  assert.equal(response.evidence[0].indicator, '29171');
  assert.match(response.answer, /243\.967/);
});

test('nao inventa resposta para tema indisponivel', async () => {
  const response = await answerQuestion('Quais empresas venceram mais licitacoes?');
  assert.equal(response.status, 'not_available');
  assert.equal(response.evidence.length, 0);
  assert.match(response.answer, /nao ha um dado publico governado/i);
});

