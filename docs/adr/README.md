# Decisões arquiteturais canônicas (ADRs)

Esta é a coleção canônica de decisões aceitas para o projeto. Cada ADR registra contexto, decisão, consequências e alternativas. Uma decisão aceita orienta a implementação, mas não declara automaticamente que todos os componentes dela já estão entregues.

| ADR | Decisão | Estado de implementação |
|---|---|---|
| [ADR-001](ADR-001-memory-vs-knowledge.md) | Separar memória de conhecimento derivado | Base de fatos e evidências em PostgreSQL; grafo ainda não adotado. |
| [ADR-002](ADR-002-postgresql-source-of-truth.md) | PostgreSQL como fonte de verdade | Aplicado no catálogo, fatos e visões públicas. |
| [ADR-003](ADR-003-knowledge-graph-when-justified.md) | Grafo apenas quando justificado | Pendente de pergunta relacional não resolvida por PostgreSQL. |
| [ADR-004](ADR-004-provenance-by-default.md) | Proveniência por padrão | Aplicado aos recortes publicados. |
| [ADR-005](ADR-005-event-driven-ingestion.md) | Ingestão orientada a eventos | Parcialmente aplicada; evolução continua no backlog. |
| [ADR-006](ADR-006-mcp-as-interface.md) | MCP como interface, não núcleo | Aplicado; portal e API usam o núcleo de dados sem depender do MCP. |
| [ADR-007](ADR-007-multi-city-by-design.md) | Multi-cidade por design | Planejado; ainda não validado com segunda cidade. |
| [ADR-008](ADR-008-open-code-data-governance-separation.md) | Separar código aberto de governança de dados | Aplicado. |
| [ADR-009](ADR-009-explainable-insights.md) | Insights explicáveis e auditáveis | Aplicado às respostas e regras públicas. |
| [ADR-010](ADR-010-data-license-separation.md) | Separar licença do código e licença dos dados | Aplicado; revisão por fonte continua. |
| [ADR-011](ADR-011-non-accusatory-public-insights.md) | Insights públicos não acusatórios | Aplicado nas respostas e recusas públicas. |

## Coleção anterior de arquitetura

Os arquivos em `docs/architecture/adr/` são propostas e rascunhos arquiteturais preservados. Eles não são a lista de decisões vigentes e não devem receber novos números de ADR. Veja [o índice histórico](../architecture/adr/README.md).
