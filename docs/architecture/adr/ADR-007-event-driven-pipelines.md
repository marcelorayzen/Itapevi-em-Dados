# ADR-007 — Pipelines orientados a eventos

- **Status:** Proposta
- **Contexto:** coleta, extração, revisão e projeções devem ser desacopladas e reexecutáveis.
- **Decisão:** cada mudança relevante gera evento imutável e consumidores idempotentes; a tecnologia de fila será escolhida na Fase 1.
- **Consequência:** há mais contratos e observabilidade, mas falhas podem ser reprocessadas sem corromper histórico.
