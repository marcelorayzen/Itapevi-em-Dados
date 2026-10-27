# F1 — Validação PostgreSQL e persistência de artefato

## Escopo

Validação local da persistência do piloto F1 no PostgreSQL. Não representa deploy, API pública ou autorização de redistribuição de dados.

- **Data:** 27/10/2026
- **Banco:** PostgreSQL 16 em Docker Compose, exposto apenas em `127.0.0.1:55433`.
- **Migração aplicada:** `001_provenance.sql`
- **Tabelas:** `sources`, `datasets`, `artifacts`, `processing_runs`, `evidence`, `events`, `event_evidence` e `schema_migrations`.

## Evidência de artefato

O catálogo registrou `SRC-LOA-2026-001` e `DS-LOA-2026`. O PDF oficial da LOA 2026 foi registrado como artefato local, sem copiar seu conteúdo para o Git.

| Campo | Valor |
|---|---|
| `artifact_id` | `1c909673-3990-4dbb-b662-9711b5769b63` |
| SHA-256 | `D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032` |
| Tamanho | 1.932.653 bytes |
| Armazenamento | `local-only` |
| Redistribuição | `pending_review` |
| Publicação | `blocked_pending_terms_review` |

## Idempotência

O mesmo comando de registro foi executado duas vezes com o mesmo arquivo. As duas respostas retornaram o mesmo `artifact_id` e a consulta final retornou `artifact_count = 1`. A chave SHA-256, única na tabela `artifacts`, impede duplicação do original coletado.

## Limites

- A base local contém metadados e checksum; o PDF e as saídas do Docling permanecem em `.local/`, ignorados pelo Git.
- Ainda não há `processing_run`, `evidence` ou `event` aceito persistido. Esses itens pertencem às etapas F1-04 e F1-05, após validação manual da qualidade das tabelas.
- O banco local não substitui uma definição futura de retenção, backup, credenciais ou operação de produção.
