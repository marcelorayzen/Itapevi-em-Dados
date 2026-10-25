# ADR-009 — Multi-cidade desde a fundação

- **Status:** Proposta
- **Contexto:** o produto deve poder atender outros municípios sem duplicar núcleo ou contaminar dados.
- **Decisão:** modelar `tenant`, `municipio`, `dataset` e configurações de fontes como escopo obrigatório em dados, jobs e autorização.
- **Consequência:** aumenta o cuidado inicial de schema e testes, mas evita migração estrutural e vazamento de dados posteriormente.
