# ADR-003 — Grafo de conhecimento quando justificado

- **Status:** Aceito
- **Contexto:** nem toda consulta exige um grafo, mas relações públicas podem exigir navegação por caminhos.
- **Decisão:** introduzir grafo somente para relações que justifiquem consulta relacional, como Empresa–Licitação–Contrato.
- **Consequências:** reduz complexidade prematura e exige sincronização a partir da fonte de verdade.
- **Alternativas consideradas:** grafo para todos os dados; rejeitado por custo e complexidade desnecessários.
