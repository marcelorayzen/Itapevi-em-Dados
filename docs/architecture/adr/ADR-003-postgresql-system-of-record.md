# ADR-003 — PostgreSQL como fonte de verdade

- **Status:** Proposta
- **Contexto:** a plataforma precisa de transações, histórico, revisão e auditoria consistentes.
- **Decisão:** PostgreSQL armazena tenants, datasets, fontes, artefatos, execuções, eventos, fatos, evidências e decisões de revisão.
- **Consequência:** busca, grafo, vetores e dashboards são projeções reprocessáveis, nunca a única cópia de dados.
