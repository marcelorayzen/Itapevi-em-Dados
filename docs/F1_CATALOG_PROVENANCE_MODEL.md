# F1 — Catálogo e proveniência mínimos

## Objetivo

Permitir rastrear cada fato candidato até o arquivo, a coleta e a posição documental que o sustentam. O modelo é agnóstico ao banco de dados e não autoriza publicação de dados de fonte.

## Entidades

| Entidade | Papel | Campos mínimos |
|---|---|---|
| `source` | Órgão/canal que disponibiliza a informação | `source_id`, órgão responsável, URL-base, termos, condição de redistribuição, última revisão |
| `dataset` | Conjunto lógico coletado de uma fonte | `dataset_id`, `source_id`, escopo, periodicidade, schema, status |
| `artifact` | Arquivo ou resposta original imutável | `artifact_id`, `dataset_id`, URL, coletado em, mídia, SHA-256, referência de armazenamento, retenção |
| `run` | Uma tentativa de processamento | `run_id`, `artifact_id`, iniciado/encerrado em, ferramenta/versão, configuração, estado, erro quando houver |
| `evidence` | Localizável no artefato que sustenta uma extração | `evidence_id`, `artifact_id`, página, seção/tabela, trecho ou coordenada, checksum do artefato |
| `event` | Fato temporal candidato, nunca inferência acusatória | `event_id`, tipo, data, payload estruturado, estado, `run_id` |
| `event_evidence` | Relação entre fato e suas evidências | `event_id`, `evidence_id`, papel da evidência |

## Relações e invariantes

```text
source 1 ── N dataset 1 ── N artifact 1 ── N run
                                      └── N evidence ── N event_evidence ── N event
```

- Todo `artifact` possui um SHA-256 calculado sobre o original recebido.
- Todo `run` referencia exatamente um artefato e registra versão da ferramenta/configuração.
- Todo `event` possui ao menos uma `evidence`; ausência de evidência implica estado `nao_confirmado` ou rejeição.
- `event` preserva fatos e estados verificáveis. Não guarda diagnóstico de irregularidade, culpa ou favorecimento.
- Um derivado pode ser reconstruído a partir de `artifact` + `run`; grafo ou índice de busca não se tornam fonte de verdade.

## Estados

| Entidade | Estados |
|---|---|
| `artifact` | `collected`, `validated`, `rejected`, `retained_local`, `purged` |
| `run` | `started`, `succeeded`, `failed`, `partial` |
| `event` | `candidate`, `accepted`, `nao_confirmado`, `rejected` |

## Exemplo controlado — LOA 2026

```json
{
  "source_id": "SRC-LOA-2026-001",
  "dataset_id": "DS-LOA-2026",
  "artifact": {
    "artifact_id": "art_loa_2026_sha256_d091a74c",
    "source_url": "https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf",
    "media_type": "application/pdf",
    "checksum": "sha256:D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032",
    "storage_ref": "local-only",
    "publication_status": "blocked_pending_terms_review"
  },
  "run": {
    "run_id": "run_loa_2026_docling_001",
    "tool": "Docling",
    "state": "started"
  }
}
```

O exemplo é um registro de experimento local: não disponibiliza o PDF, Markdown, JSON ou tabela derivada.

## Próximo uso

O primeiro experimento Docling deve produzir um `artifact`, um `run` e métricas de saída. Eventos e evidências só serão aceitos após inspeção de qualidade e definição do conjunto manual de referência.

## Aprovação

- **Data:** 27/10/2026
- **Decisor:** Marcelo Augusto
- **Decisão:** modelo aprovado para F1. Implementações futuras devem preservar seus invariantes de proveniência e evidência.
