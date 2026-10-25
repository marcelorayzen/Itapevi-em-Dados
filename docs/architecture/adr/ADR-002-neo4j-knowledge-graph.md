# ADR-002 — Neo4j para a projeção de conhecimento

- **Status:** Proposta, condicionada a prova de conceito e custo operacional.
- **Contexto:** consultas relacionais exigem caminhos, vizinhanças e agrupamentos além de joins convencionais.
- **Decisão:** usar Neo4j como projeção de entidades e relações aceitas, não como autoridade de escrita.
- **Consequência:** exige sincronização idempotente, monitoramento de defasagem e plano de reconstrução a partir do PostgreSQL.
