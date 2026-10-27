# F1 — Validação de evento e evidências

## Execução interna

- **Data:** 27/10/2026
- **Artefato:** LOA 2026 registrada por checksum no PostgreSQL local.
- **Transformação:** `loa-normalizer` versão `f1-loa-v1`.
- **Resultado:** execução `succeeded`; evento `municipal_budget_law_declared` em estado `candidate`.

## Cadeia verificada

Uma consulta interna recuperou, a partir do evento:

1. o `source_id` `SRC-LOA-2026-001`;
2. a URL oficial do PDF e o instante de coleta do artefato;
3. o nome, versão e estado da transformação;
4. três evidências vinculadas às páginas 1 e 2: identificação da lei, Art. 1º e Art. 2º.

## Limites

- O evento é um candidato interno: não é uma publicação, insight ou conclusão sobre execução orçamentária.
- As evidências apontam para página e seção; não armazenam trechos do PDF no repositório.
- Tabelas permanecem fora do evento, pois não passaram na validação manual de fidelidade.
- A publicação segue bloqueada enquanto termos e redistribuição da fonte estiverem em `pending_review`.
