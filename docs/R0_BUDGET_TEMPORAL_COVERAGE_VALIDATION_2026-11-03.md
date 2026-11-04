# Validação temporal da cobertura orçamentária

**Data:** 03/11/2026  
**Estado:** concluída no PostgreSQL e publicada pelo Worker em 03/11/2026.  
**Escopo:** execução orçamentária por órgão no painel LAI `Previsto e Empenhado por Programa e Secretaria`.

## Objetivo

Registrar cada recorte mensal como um fato distinto e impedir que o portal some valores de períodos diferentes. O painel de origem pode apresentar medidas realizadas cumulativas; por isso, uma soma entre exportações mensais seria uma inferência não demonstrada.

## Recortes persistidos

| Período | Filtro | Registros de origem | Órgãos na visão pública | Previsto | Realizado | Checksum SHA-256 |
|---|---|---:|---:|---:|---:|---|
| 01/09/2026–30/09/2026 | `Data de Empenho`, metadado no JSON | 47 | 20 | R$ 588.275.022,12 | R$ 18.710.607,40 | `32EBD6B957F9D142E99A24EB802DD8A8DCDAE5ED2349FEE0A380EB7F6B9A7E70` |
| 01/10/2026–31/10/2026 | `Data de Empenho`, confirmado pelo operador na tela oficial de exportação | 162 | 25 | R$ 4.174.430.898,82 | R$ 3.768.964.374,91 | `71741D9ED869321E5082C81E444FF7361D65711EC7A7326ABC7BDB148ABDF0C1` |

O período de setembro veio nos filtros internos do arquivo JSON. O arquivo CSV de outubro não contém o filtro exportado; por isso a normalização registra explicitamente `source: operator_confirmed`, em vez de fingir que o metadado veio do arquivo.

## Mudança técnica

- a tabela `budget_execution_records` recebeu `period_start`, `period_end` e `temporal_filter` obrigatórios;
- a chave de reprocessamento passou a ser `(artifact_id, record_key)`, permitindo a mesma linha em artefatos de meses distintos;
- a visão `public_api.budget_execution_summary` agrupa por órgão **e** período;
- o Worker lista recortes disponíveis e filtra cada consulta por início e fim de período;
- quando a pergunta informa apenas o ano de 2026, o Worker pede o mês. Ele não soma setembro e outubro.

## Como conferir

1. Abra o [painel LAI de Itapevi](https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418).
2. Selecione **Previsto e Empenhado por Programa e Secretaria**.
3. Aplique `Data de Empenho` e um dos intervalos da tabela.
4. Exporte o resultado, confira o checksum local e compare órgãos e totais com a resposta do portal.

## Publicação verificada

- Worker publicado: `ab3b331f-0e30-4395-b114-692f07385cc2`.
- `GET https://api-dados.rayzen.com.br/health` confirmou `hyperdriveConfigured: true` e `aiPilotEnabled: true` após a publicação.
- Uma chamada sem token Turnstile retornou `403 verification_required`, confirmando que a rota de perguntas não ficou aberta sem a proteção antiabuso.

## Limites

- os valores representam somente as linhas devolvidas pelo painel para cada recorte;
- não provam cobertura integral do orçamento municipal, desempenho, legalidade, regularidade ou responsabilidade;
- outubro usa a confirmação operacional do filtro enquanto se aguarda um formato de exportação que inclua os metadados no próprio arquivo;
- meses anteriores a setembro de 2026 ainda não foram carregados. A expansão histórica está em `R0-17`.
