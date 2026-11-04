# Estado atual do produto público

**Atualizado em:** 03/11/2026  
**Finalidade:** referência canônica para demonstrações, avaliação institucional e manutenção. Registros históricos continuam preservados, mas não substituem este documento; veja [Governança da documentação](DOCUMENTATION_STATUS.md).

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
- execução orçamentária por órgão no recorte de 01/09/2026 a 30/09/2026;
- pagamentos mensais com vínculo explícito a pronto-socorro ou SAMU.

Cada resposta factual retorna fonte oficial, identificador de origem, dataset, checksum, período, cobertura, instruções de conferência e limitações. O portal não conclui fraude, irregularidade, favorecimento, culpa ou legalidade. A fonte pode ser aberta em **Ver trilha de auditoria**.

## Perguntas naturais

O Worker já contém um contrato fechado para interpretar intenções, mas o recurso público de IA está **desativado** (`AI_PILOT_ENABLED=false`). O modelo não produz fatos nem SQL; ele só poderá selecionar rotas internas aprovadas após a avaliação N4.

| Etapa | Estado |
|---|---|
| N1 — contrato estruturado e validação local | concluída |
| N2 — roteador semântico e fallback | concluída |
| N3 — orçamento por órgão | concluída |
| N4 — 40 perguntas reais anonimizadas | coleta pendente |
| N5 — ativação pública da IA | bloqueada por N4 e decisão formal |

## Estado das entregas públicas

| Entrega | Estado | Evidência de manutenção |
|---|---|---|
| API restrita de fatos agregados | publicada | [API pública](F3_PUBLIC_API_WORKER.md) |
| Portal público sem login | publicado | [manual](USER_MANUAL.md) |
| Proteção antiabuso | publicada | Turnstile e limite de requisições antes da consulta |
| Trilha de auditoria por resposta | publicada | [trilha pública](PUBLIC_AUDIT_TRAIL.md) |
| IA para interpretação livre | desativada ao público | N4 pendente |

## O que ainda não é oferecido

- respostas factuais para temas sem dataset ou recorte publicado;
- consulta livre a documentos, tabelas brutas, processos ou dados pessoais;
- afirmações acusatórias ou conclusões sobre conduta;
- cobertura orçamentária fora do período publicado;
- grafo de conhecimento, multi-cidade ou agentes autônomos como capacidades públicas.

## Referências operacionais

- [Manual de uso](USER_MANUAL.md)
- [Plano do piloto de perguntas naturais](NATURAL_LANGUAGE_PILOT_PLAN.md)
- [Protocolo N4 de avaliação](NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md)
- [Operação e segurança](OPERATIONS.md)
- [Backlog](BACKLOG.md)
