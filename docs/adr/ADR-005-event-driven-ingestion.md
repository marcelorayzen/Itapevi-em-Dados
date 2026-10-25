# ADR-005 — Ingestão orientada a eventos

- **Status:** Aceito
- **Contexto:** coleta, extração, revisão e projeções precisam ser desacopladas e reexecutáveis.
- **Decisão:** registrar eventos imutáveis e usar consumidores idempotentes; a tecnologia de fila será escolhida depois.
- **Consequências:** exige contratos e observabilidade, mas permite reprocessar falhas.
- **Alternativas consideradas:** pipeline síncrono monolítico; rejeitado por fragilidade e baixa rastreabilidade.
