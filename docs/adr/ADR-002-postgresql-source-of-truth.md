# ADR-002 — PostgreSQL como fonte de verdade

- **Status:** Aceito
- **Contexto:** V2 precisa de histórico, transações, revisão e evidências consistentes.
- **Decisão:** PostgreSQL será a fonte inicial de verdade proposta para dados operacionais, eventos e proveniência.
- **Consequências:** busca, grafo e dashboards são projeções reprocessáveis.
- **Alternativas consideradas:** usar somente grafo ou índice de busca; rejeitados como autoridade única.
