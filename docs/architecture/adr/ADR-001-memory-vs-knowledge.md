# ADR-001 — Separar Memory Engine e Knowledge Engine

- **Status:** Proposta
- **Contexto:** eventos históricos e relações navegáveis possuem ciclos, garantias e consultas diferentes.
- **Decisão:** registrar eventos/fatos versionados no Memory Engine e projetar relações aceitas no Knowledge Engine.
- **Consequência:** o grafo é reconstruível; toda relação deve apontar aos eventos/evidências que a sustentam.
