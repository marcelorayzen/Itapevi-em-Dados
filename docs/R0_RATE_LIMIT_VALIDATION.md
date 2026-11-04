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

## Limite de validação operacional (registro intermediário)

Foram realizadas 31 tentativas externas sem token na mesma janela de teste. Todas receberam `403`; não foi observado `429`. Isso não prova que o limite é estrito nem que falhou: a documentação do Cloudflare declara que esta binding é aproximada e aplicada por localização, com atualização de contadores em segundo plano.

Por rigor, naquele momento o resultado foi **implementado e testado por unidade; validação externa de limiar pendente**. A seção seguinte registra a conclusão posterior do escopo R0-10.

## Validação humana e conclusão do escopo R0-10

Após a publicação, Marcelo confirmou em 31/10/2026 que validou o comportamento esperado. A telemetria mínima foi habilitada em seguida; portanto, **R0-10 está concluído para o escopo do piloto**. A validação de carga de alto volume permanece uma melhoria futura, não uma condição omitida de conclusão.

## Telemetria mínima

O Worker envia um contador não bloqueante ao dataset `itapevi_em_dados_public_api` do Cloudflare Analytics Engine. Cada ponto contém somente:

- evento técnico: `question` ou `request`;
- resultado técnico: `answer_ok`, `not_available`, `verification_required`, `rate_limited`, `rate_limit_unavailable`, `invalid_request`, `unavailable` ou `not_found`;
- valor constante `1` para agregação.

Não são enviados pergunta, resposta, IP, token Turnstile, user-agent, identificação de cidadão ou fonte consultada. A plataforma Cloudflare mantém esse dataset por até três meses, segundo sua política técnica.

Em 31/10/2026, o primeiro deploy foi recusado pela API da Cloudflare com erro `10089`: Analytics Engine não estava habilitado na conta. Após habilitação humana, o Worker foi publicado com sucesso na versão `cdbdef23-ae2e-4deb-a3cf-a044c881c01e`. Uma tentativa sem token retornou `403 verification_required`, mantendo fonte e IA sem consulta e exercitando o evento técnico de bloqueio. R0-10 está concluído para o escopo do piloto.
