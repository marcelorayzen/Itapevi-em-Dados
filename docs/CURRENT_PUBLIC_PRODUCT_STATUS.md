# Estado atual do produto público

**Atualizado em:** 03/11/2026  
**Finalidade:** referência pública para demonstrações e avaliação institucional.

## O que está publicado

| Componente | Endereço | Estado |
|---|---|---|
| Portal público | `https://itapevi-em-dados.rayzen.com.br` | Público, sem login, protegido por verificação antiabuso antes da consulta. |
| API pública | `https://api-dados.rayzen.com.br` | Cloudflare Worker com Hyperdrive para PostgreSQL Neon; `GET /health` e `POST /v1/ask`. |
| Banco público | Visões `public_api` | Apenas agregados aprovados; tabelas brutas e artefatos locais não são expostos. |

## Cobertura publicada

- estimativa populacional de Itapevi pelo IBGE;
- contratos municipais agregados de 2024 a 2026;
- licitações municipais agregadas de 2024 a 2026;
- execução orçamentária por órgão em dois recortes mensais distintos: 01/09/2026 a 30/09/2026 e 01/10/2026 a 31/10/2026;
- pagamentos mensais com vínculo explícito a pronto-socorro ou SAMU.

Cada resposta factual retorna fonte oficial, identificador de origem, dataset, checksum, período, cobertura, instruções de conferência e limitações. O portal não conclui fraude, irregularidade, favorecimento, culpa ou legalidade. A fonte pode ser aberta em **Ver trilha de auditoria**.

## Perguntas naturais

O piloto público de IA está **ativo de forma controlada** (`AI_PILOT_ENABLED=true`), por aprovação explícita de Marcelo em 03/11/2026. O modelo apenas classifica a pergunta em uma intenção fechada; Zod valida a saída e as rotas internas usam somente consultas parametrizadas em visões públicas. O modelo não produz fatos, não executa SQL, não lê artefatos brutos e não amplia o catálogo. A coleta N4 continua durante o piloto e é revisada semanalmente por Marcelo e Rayzen.

| Etapa | Estado |
|---|---|
| N1 — contrato estruturado e validação local | concluída |
| N2 — roteador semântico e fallback | concluída |
| N3 — orçamento por órgão | concluída |
| N4 — 40 perguntas reais anonimizadas | em andamento durante o piloto |
| N5 — ativação pública da IA | ativação controlada aprovada em 03/11/2026 |

## Estado das entregas públicas

| Entrega | Estado | Evidência de manutenção |
|---|---|---|
| API restrita de fatos agregados | publicada | [API pública](F3_PUBLIC_API_WORKER.md) |
| Portal público sem login | publicado | [manual](USER_MANUAL.md) |
| Proteção antiabuso | publicada | Turnstile e limite de requisições antes da consulta |
| Trilha de auditoria por resposta | publicada | [trilha pública](PUBLIC_AUDIT_TRAIL.md) |
| IA para interpretação de intenções | piloto público monitorado | contrato fechado, Turnstile, rate limit e revisão semanal |

## O que ainda não é oferecido

- respostas factuais para temas sem dataset ou recorte publicado;
- consulta livre a documentos, tabelas brutas, processos ou dados pessoais;
- afirmações acusatórias ou conclusões sobre conduta;
- resposta orçamentária que some automaticamente recortes mensais diferentes ou cubra período ainda não carregado;
- grafo de conhecimento, multi-cidade ou agentes autônomos como capacidades públicas.

## Referências operacionais

- [Manual de uso](USER_MANUAL.md)
- [API pública de perguntas](F3_PUBLIC_API_WORKER.md)
- [Registro de fontes e condições de uso](DATA_SOURCES_REGISTER.md)
- [Pedido de avaliação institucional ao BBSIA](BBSIA_REVIEW_REQUEST.md)
