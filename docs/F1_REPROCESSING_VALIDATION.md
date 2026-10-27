# F1 — Validação de reprocessamento e observabilidade

## Idempotência

Após aplicar a migração `002_processing_run_deduplication.sql`, o mesmo candidato normalizado da LOA 2026 foi submetido novamente.

| Medida | Antes | Depois |
|---|---:|---:|
| Execuções de processamento | 1 | 1 |
| Eventos | 1 | 1 |
| Evidências | 3 | 3 |

A segunda execução retornou o mesmo `run_id` e `event_id` existentes com `reused: true`. A deduplicação usa artefato, processador, versão e configuração; o banco impõe unicidade para a chave de execução.

## Falha rastreável

Uma execução local de verificação foi marcada deliberadamente como `failed`, sem evento associado. Ela ficou consultável pelo identificador `96b20a29-1269-41ae-a0a7-fab794d0d4ac`, com a mensagem `controlled verification failure`.

Esse registro é evidência de teste local, não dado municipal e não é exposto por MCP/API.

## Limites

- A cobertura atual mede a reexecução da mesma entrada e configuração; mudanças reais de documento ou configuração devem criar uma nova execução rastreável.
- Métricas de cobertura por período/fonte ainda serão definidas quando existir uma segunda fonte autorizada.
- A publicação de qualquer evento continua bloqueada pela governança de termos da fonte.
