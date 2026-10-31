# R0 — Validação do limite de requisições

## Implementação

Em 31/10/2026, após aprovação de Marcelo, o Worker público recebeu a binding nativa `PUBLIC_QUERY_RATE_LIMITER` do Cloudflare com configuração de dez tentativas por sessenta segundos. A chave entregue ao contador é o SHA-256 da origem informada pela borda; o código do projeto não grava IP, pergunta ou chave em logs próprios.

O limitador é verificado antes de Turnstile, IBGE e Workers AI. Os resultados possíveis são:

| Situação | Resposta |
|---|---|
| dentro do limite | prossegue para Turnstile |
| limite atingido | `429 rate_limited` |
| binding indisponível | `503 rate_limit_unavailable` (falha fechada) |

## Evidências verificadas

- 7 testes unitários aprovados, incluindo limite atingido, hash sem IP em texto claro e falha fechada;
- `wrangler deploy --dry-run` reconheceu a binding `PUBLIC_QUERY_RATE_LIMITER (10 requests/60s)`;
- deploy de produção concluído na versão `e1735730-f6af-4922-a206-f2e25d4c7c04`;
- consultas externas sem token continuaram recebendo `403 verification_required`, portanto não alcançaram fontes nem IA.

## Limite de validação operacional

Foram realizadas 31 tentativas externas sem token na mesma janela de teste. Todas receberam `403`; não foi observado `429`. Isso não prova que o limite é estrito nem que falhou: a documentação do Cloudflare declara que esta binding é aproximada e aplicada por localização, com atualização de contadores em segundo plano.

Por rigor, o resultado é **implementado e testado por unidade; validação externa de limiar pendente**. O item R0-10 permanece em andamento. Antes de ativar Workers AI, a próxima revisão deve observar métricas do Cloudflare ou executar teste controlado de carga a partir de uma única localização estável.

## Validação humana

Após a publicação, Marcelo confirmou em 31/10/2026 que validou o comportamento esperado. A confirmação humana encerra a verificação de uso do piloto; R0-10 permanece em andamento somente pela telemetria mínima ainda não implementada.
