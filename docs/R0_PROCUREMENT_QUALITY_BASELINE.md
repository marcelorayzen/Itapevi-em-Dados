# R0 - Linha de base de qualidade de contratos e licitações

Execução local em 01/11/2026 pelo comando `npm run db:audit:procurement-quality`.

| Indicador | Resultado |
|---|---:|
| Contratos 2024 / 2025 / 2026 | 68 / 68 / 75 |
| Licitações 2024 / 2025 / 2026 | 110 / 190 / 119 |
| Vínculos de alta confiança | 55 |
| Contratos sem processo informado | 31 |
| Licitações sem contrato vinculado | 377 |

Ausência de vínculo não é irregularidade: pode refletir cobertura, período, modalidade, contratos sem processo informado ou uma relação não demonstrável pelos arquivos disponíveis. A API pública não deve inferir causa nem conduta a partir desses indicadores.

## Fechamento da validação em 02/11/2026

- Os 211 contratos possuem 211 chaves de deduplicação distintas.
- As 419 licitações possuem 419 chaves de deduplicação distintas.
- A reconciliação é feita por artefato/checksum, não somente por exercício, evitando misturar uma licitação publicada em um ano com abertura ou referência no seguinte.
- Os três artefatos de compras reconciliaram 110, 192 e 117 registros, respectivamente, com seus totais de compra e estimativa preservados na auditoria.
- Há 55 vínculos de alta confiança; 31 contratos sem processo e 377 licitações sem contrato vinculado seguem como lacunas explícitas, não como indícios de conduta.

R0-05 está concluído para os artefatos disponíveis. Novas exportações devem reexecutar `npm run db:audit:procurement-quality` antes de serem disponibilizadas.
