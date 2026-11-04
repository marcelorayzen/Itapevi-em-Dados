# Documentação do Itapevi em Dados

Esta pasta separa claramente o produto que está publicado, o trabalho em curso, a direção arquitetural e os registros históricos. **Para qualquer afirmação sobre o estado atual, comece pelos documentos canônicos abaixo.** A convenção completa está em [Governança da documentação](DOCUMENTATION_STATUS.md).

## Documentos canônicos

1. [Estado atual do produto público](CURRENT_PUBLIC_PRODUCT_STATUS.md) — endereços publicados, cobertura e limites.
2. [Capacidades e cobertura](CAPABILITIES.md) — o que cada consulta pode e não pode responder.
3. [Manual de uso](USER_MANUAL.md) e [Trilha de auditoria pública](PUBLIC_AUDIT_TRAIL.md) — como consultar e conferir uma resposta.
4. [Operação e segurança](OPERATIONS.md) — serviços, limites de acesso e rotina de publicação.
5. [Plano de desenvolvimento](DEVELOPMENT_PLAN.md) e [Backlog](BACKLOG.md) — tarefas, estados e próximos critérios de aceite.
6. [Registro de fontes](DATA_SOURCES_REGISTER.md) e [revisão de dados/licenças](P0_DATA_LICENSE_REVIEW.md) — condição de uso, proveniência e limites.
7. [ADRs canônicos](adr/README.md) — decisões que orientam a evolução.

## Produto público e avaliação

- [Experiência do portal e demonstração](PRODUCT_PORTAL_EXPERIENCE.md)
- [API pública de perguntas](F3_PUBLIC_API_WORKER.md)
- [Piloto de perguntas naturais](NATURAL_LANGUAGE_PILOT_PLAN.md)
  - [Validação N1](NATURAL_LANGUAGE_PILOT_N1_VALIDATION.md)
  - [Validação N2](NATURAL_LANGUAGE_PILOT_N2_VALIDATION.md)
  - [Validação N3](NATURAL_LANGUAGE_PILOT_N3_VALIDATION.md)
  - [Protocolo N4](NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md)
  - [Primeiro achado de N4](NATURAL_LANGUAGE_PILOT_N4_EARLY_FINDINGS.md)
- [Validação de consulta pública](R0_PUBLIC_QUERY_VALIDATION_2026-11-03.md)
- [Prontidão para testes públicos](PUBLIC_TEST_READINESS_CHECK_2026-11-03.md)
- [Integração BBSIA](BBSIA_INTEGRATION.md) e [pedido de avaliação](BBSIA_REVIEW_REQUEST.md)

## Arquitetura e direção

- [Visão](vision.md), [princípios](principles.md) e [roadmap](roadmap.md)
- [Arquitetura-alvo](architecture/architecture.md) e [snapshot histórico da V1](architecture/current-state.md)
- [Ontologia](data/ontology.md), [proveniência](governance/provenance.md) e [blueprint](engineering/implementation-blueprint.md)

## Registros técnicos e históricos

As validações F1–F4, R0 e os documentos de prévia privada registram decisões e testes datados. Eles são evidência útil, mas não substituem os documentos canônicos quando descrevem uma etapa anterior. Para navegação por fase, consulte o [backlog](BACKLOG.md).

## Avaliação BBSIA

- [Status técnico do protótipo local](PROTOTYPE_STATUS.md)
- [Integração BBSIA](BBSIA_INTEGRATION.md)
- [Pedido de avaliação institucional ao BBSIA](BBSIA_REVIEW_REQUEST.md)
- [Estratégia de código aberto](OPEN_SOURCE_STRATEGY.md)
- [Reuso e implantação](REUSE_AND_DEPLOYMENT.md)
- [Governança de dados](DATA_GOVERNANCE.md)
- [Registro de fontes](DATA_SOURCES_REGISTER.md)
- [Revisão de termos e licenças das fontes](P0_DATA_LICENSE_REVIEW.md)
- [Inventário inicial de licenças](DEPENDENCY_LICENSE_INVENTORY.md)
- [Checklist de segurança e release](SECURITY_AND_RELEASE_CHECKLIST.md)
- [Decisão do piloto F1](F1_PILOT_DECISION.md)
- [Especificação de Document Intelligence da F1](F1_DOCUMENT_INTELLIGENCE_SPEC.md)
- [Registro de descoberta de fontes da F1](F1_SOURCE_DISCOVERY_LOG.md)
- [Escopo de resolução de entidades da F2](F2_ENTITY_RESOLUTION_SCOPE.md)
- [Validação da resolução de entidades da F2](F2_ENTITY_RESOLUTION_VALIDATION.md)
- [Avaliação relacional da F2](F2_RELATIONAL_PROJECTION_EVALUATION.md)
- [Validação da consulta citável da F2](F2_CITABLE_QUERY_VALIDATION.md)
- [Validação atual da consulta pública](R0_PUBLIC_QUERY_VALIDATION_2026-11-03.md)
- [Check-up de prontidão para testes públicos](PUBLIC_TEST_READINESS_CHECK_2026-11-03.md)
- [Plano do piloto de perguntas naturais](NATURAL_LANGUAGE_PILOT_PLAN.md)
  - [Validação N1 do contrato de perguntas naturais](NATURAL_LANGUAGE_PILOT_N1_VALIDATION.md)
  - [Validação N2 do roteador semântico](NATURAL_LANGUAGE_PILOT_N2_VALIDATION.md)
  - [Validação N3 da cobertura orçamentária](NATURAL_LANGUAGE_PILOT_N3_VALIDATION.md)
  - [Protocolo N4 de avaliação com perguntas reais](NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md)
  - [Primeiro achado corrigido de N4](NATURAL_LANGUAGE_PILOT_N4_EARLY_FINDINGS.md)
- [Contrato comum de resposta da F3](F3_RESPONSE_CONTRACT.md)
- [Validação do catálogo de datasets da F3](F3_DATASET_CATALOG_VALIDATION.md)
- [Validação da demonstração web local da F3](F3_WEB_DEMO_VALIDATION.md)
- [Experiência do portal e demonstração institucional](PRODUCT_PORTAL_EXPERIENCE.md)
- [Avaliação histórica de API pública da F3](F3_PUBLIC_API_EVALUATION.md)
- [Prévia privada de API da F3 (alternativa não ativada)](F3_PRIVATE_PREVIEW_VALIDATION.md)
- [Preparação histórica da prévia privada](PRIVATE_PREVIEW_DEPLOYMENT.md)
- [API pública de perguntas no Cloudflare Worker](F3_PUBLIC_API_WORKER.md)
  - [Trilha de auditoria pública](PUBLIC_AUDIT_TRAIL.md)
- [Publicação da demonstração estática](PUBLIC_DEMO_DEPLOYMENT.md)
- [Validação da exportação municipal LAI](F1_LAI_EXPORT_VALIDATION.md)
- [Validação da exportação municipal de compras](F1_LAI_PROCUREMENT_EXPORT_VALIDATION.md)
- [Insight de execução orçamentária](F4_BUDGET_EXECUTION_INSIGHT.md)
- [Validação de insights não acusatórios](F4_NON_ACCUSATORY_VALIDATION.md)
- [Relatório semanal de alertas](F4_WEEKLY_ALERT_REPORT.md)
- [Validação da estimativa IBGE 2026](F1_IBGE_2026_VALIDATION.md)
- [Validação do piloto agregado TCESP](F1_TCESP_AGGREGATE_VALIDATION.md)
- [Melhorias futuras registradas](FUTURE_IMPROVEMENTS.md)

Os documentos de visão, princípios, arquitetura, roadmap e ontologia descrevem a direção V2. Eles não tornam componentes planejados recursos implantados.
