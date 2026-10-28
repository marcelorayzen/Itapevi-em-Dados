# F4 - Insight de execucao orcamentaria

## Regra

Para cada linha retornada pela exportacao LAI, o percentual e `valor realizado / valor previsto * 100`. O percentual agregado usa a soma dos valores realizados dividida pela soma dos valores previstos.

## Cobertura

Piloto: exportacao LAI de setembro de 2026, filtrada por data de empenho. Cobre somente as 47 linhas retornadas pelo painel naquele filtro.

## Linguagem e limites

O insight descreve percentual de execucao; nao declara atraso, irregularidade, eficiencia, culpa ou favorecimento. Linhas sem valor previsto nao entram no ranking percentual. Cada resposta informa periodo, cobertura e confianca `needs_review`.
