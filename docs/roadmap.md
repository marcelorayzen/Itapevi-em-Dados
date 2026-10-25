# Roadmap V2

## Etapas de produto

| Etapa | Escopo |
|---|---|
| V1 atual | Servidor MCP, conectores iniciais, cache, health-check e testes. |
| V1.1 — abertura BBSIA | Licença, documentação, maturidade, segurança e fontes. |
| V2 Foundation | Catálogo, eventos, normalização, proveniência e lineage. |
| V2 Intelligence | Timeline, grafo aplicado, semantic layer e insights reproduzíveis. |
| V3 | Portal, dashboards, alertas e expansão multi-cidade. |

## Fase 0 — Fundação e evidência

- Aprovar documentação, responsáveis e critérios de sucesso.
- Corrigir higiene do repositório: segredos fora do versionamento, `.gitignore`, CI e inventário de fontes/licenças.
- Modelar dataset, fonte, artefato e proveniência no PostgreSQL.
- **Saída:** uma fonte V1 reprocessável de ponta a ponta, com artefato bruto e evidência exibível.

## Fase 1 — Ingestão governada

- Coleta idempotente, agendamento, retries e observabilidade.
- Prova de conceito Docling em PDFs reais antes de torná-lo padrão.
- Modelo de eventos, fatos e revisões.
- **Saída:** Diário Oficial ou licitações incremental, rastreável e reprocessável.

## Fase 2 — Conhecimento e tempo

- Resolução de entidades e aliases; projeção Neo4j para relações aceitas.
- Consultas por caminho e timeline.
- **Saída:** relação Empresa–Licitação–Contrato com cada elo citável.

## Fase 3 — Território e entrega

- Catálogo público, camada semântica, consulta territorial e contratos comuns para portal/API/MCP.
- **Saída:** pergunta por bairro combina indicador e investimento com cobertura explícita.

## Fase 4 — Insights e alertas

- Regras versionadas, alertas assináveis e relatórios automáticos.
- **Saída:** alerta explica regra, comparação, período, cobertura e evidências.

## Fase 5 — Multi-cidade

- Onboarding parametrizado e isolamento testado.
- **Saída:** segunda cidade sem alteração do núcleo e sem vazamento entre tenants.
