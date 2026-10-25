# ADR-007 — Multi-cidade por design

- **Status:** Aceito
- **Contexto:** a plataforma deve atender municípios sem misturar dados ou permissões.
- **Decisão:** modelar tenant, município, dataset e configuração de fonte como escopos explícitos.
- **Consequências:** aumenta cuidado inicial de schema e testes de isolamento.
- **Alternativas consideradas:** generalizar apenas após a primeira cidade; rejeitada por criar migração estrutural tardia.
