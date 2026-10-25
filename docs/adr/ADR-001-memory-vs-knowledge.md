# ADR-001 — Separação entre Memory e Knowledge

- **Status:** Aceito
- **Contexto:** eventos históricos e relações navegáveis têm ciclos e garantias distintos.
- **Decisão:** tratar eventos e fatos como memória versionada; projetar relações aceitas como conhecimento derivado.
- **Consequências:** relações devem apontar para evidências e podem ser reconstruídas.
- **Alternativas consideradas:** um único repositório sem separação; rejeitado por dificultar auditoria e reprocessamento.
