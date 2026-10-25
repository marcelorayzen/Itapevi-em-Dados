# Estado atual da V1 — inventário verificado

_Verificado no checkout `0263789`, em 24/10/2026._

## O que existe

- Servidor MCP TypeScript via `stdio`, pacote `0.1.0`.
- Ferramentas para demandas, transparência, legislação, IBGE, Meu Município, Diário Oficial e licitações.
- Coleta por APIs e scraping, com cache local.
- Endpoint HTTP `GET /health` separado do transporte MCP.
- Testes Jest para health, servidor, IBGE e licitações. O `QA_PLAN.md` registra quatro suítes aprovadas no histórico.

## O que não existe ou não está comprovado

- Não há banco transacional, grafo, catálogo de datasets, fila/eventos, Docling, resolução de entidades, modelagem espacial ou proveniência/lineage versionados.
- O health check confirma disponibilidade/lista de ferramentas; não confirma atualidade da fonte, qualidade de extração nem precisão de resposta.
- Testes locais não comprovam operação contínua em produção.

## Consequência

A V1 é uma boa base de conectores. A V2 deve mantê-los como adaptadores de fonte e introduzir um núcleo governado em incrementos, sem reescrita total.
