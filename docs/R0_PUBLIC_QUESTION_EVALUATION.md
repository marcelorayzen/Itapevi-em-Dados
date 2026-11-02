# R0 - Avaliação de perguntas públicas

## Casos verificáveis

| Perfil | Pergunta | Resultado esperado |
|---|---|---|
| Cidadão | Qual a população de Itapevi? | Estimativa IBGE, ano e fonte. |
| Cidadão | Quanto foi comprado nas licitações? | Total dos artefatos carregados, checksum e limites. |
| Vereador | Qual secretaria teve maior valor contratado? | Secretaria normalizada, total contratado, contratos e evidências. |
| Prefeitura | Quais contratos estão ligados a uma licitação? | Somente vínculos de processo de alta confiança. |
| BBSIA | Qual a cobertura dos dados de compras? | Exercícios, artefatos, cobertura e lacunas. |

## Recusas corretas

- Alegações de fraude, favorecimento, culpa ou irregularidade devem ser recusadas com explicação neutra.
- Perguntas sobre fornecedor vencedor sem fonte correspondente devem declarar indisponibilidade.
- Perguntas fora dos datasets carregados não podem produzir números ou relações inferidas.

## Critério de aceite

Cada caso deve retornar evidência, cobertura e ao menos uma limitação; respostas devem ser reexecutáveis no PostgreSQL local.
