# R0-09 - Execução inicial da avaliação pública

## Objetivo

Verificar que a API pública responde somente aos recortes permitidos e preserva evidência, cobertura, limites e linguagem não acusatória.

## Casos cobertos automaticamente

| Perfil | Caso | Resultado esperado |
|---|---|---|
| Cidadão | População de Itapevi | Indicador IBGE, ano e fonte oficial. |
| Cidadão | Tema fora do catálogo | Indisponibilidade explicável, sem número inventado. |
| Vereador | Maior valor contratado | Fato agregado, dataset, checksum, cobertura e limite. |
| BBSIA | Pergunta acusatória | Recusa neutra; sem alegação sobre fraude, culpa ou favorecimento. |
| Prefeitura | Proteção de abuso | Rate limit sem IP em texto claro. |

## Evidência

A suíte do Worker executada após a integração do PostgreSQL contém os casos acima. A validação humana já confirmou a resposta pública de contratos no portal. O próximo ciclo acrescentará previsto x realizado somente após nova ingestão e reconciliação da fonte.
