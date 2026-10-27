# F2 — Escopo inicial de resolução de entidades

## Decisão

- **Data:** 27/10/2026
- **Decisor:** Marcelo Augusto
- **Primeiro recorte aprovado:** órgãos e secretarias municipais presentes na LOA e em futuras fontes oficiais compatíveis.

## Objetivo

Criar identidades canônicas para órgãos públicos sem inferir relações pessoais, empresariais ou de conduta. A resolução de entidades permanece uma camada derivada: o documento, o artefato e a evidência continuam como autoridade.

## Modelo inicial

| Campo | Regra |
|---|---|
| `entity_id` | identificador estável interno |
| `entity_type` | inicialmente apenas `public_body` ou `municipal_secretariat` |
| `canonical_name` | nome normalizado, preservando a grafia oficial como alias/evidência |
| `aliases` | variações encontradas em documentos, cada uma com fonte e período |
| `source_evidence` | artefato, página/seção e execução que justificam a identidade |
| `confidence` | `high`, `medium` ou `needs_review`; nunca usada como certeza automática |
| `valid_from` / `valid_to` | intervalo temporal quando aplicável |

## Regras de segurança semântica

- Não unir entidades somente por similaridade textual.
- Exigir chave oficial, evidência documental ou revisão humana para fusões.
- Registrar decisões de alias/fusão com responsável, data e justificativa.
- Não criar relações de influência, responsabilidade ou irregularidade por coocorrência em documentos.
- O primeiro piloto não publica entidades; ele apenas prepara evidência interna e auditável.

## Critério de aceite de F2-01

1. Pelo menos um caso de alias de órgão/secretaria é resolvido com evidência.
2. Um caso ambíguo é mantido como `needs_review`, sem fusão automática.
3. A decisão pode ser recuperada até o artefato e a página de origem.
