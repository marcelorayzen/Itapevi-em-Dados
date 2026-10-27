# F1 - Validacao da exportacao LAI municipal

## Fonte e escopo

- **Fonte:** Prefeitura do Municipio de Itapevi, painel `LAI - Previsto e Empenhado por Programa e Secretaria`.
- **URL do painel:** `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`.
- **Artefato local:** exportacao de convidado em ZIP contendo JSON; nao versionada no Git.
- **Status de redistribuicao:** `pending_review`.
- **Uso aprovado:** processamento local controlado; sem publicacao ou redistribuicao.

## Amostra validada em 27/10/2026

| Campo | Resultado |
|---|---|
| Formato | ZIP com um JSON |
| Codificacao do JSON | Windows-1252 |
| Data da exportacao | 27/10/2026 14:27:01 |
| Usuario informado | Convidado |
| Periodo filtrado | 01/09/2026 a 30/09/2026 |
| Criterio temporal | Data de Empenho |
| Registros retornados | 47 |
| Total previsto das linhas | R$ 588.275.022,12 |
| Total realizado das linhas | R$ 18.710.607,40 |
| SHA-256 do ZIP | `32EBD6B957F9D142E99A24EB802DD8A8DCDAE5ED2349FEE0A380EB7F6B9A7E70` |

Os totais sao a soma das linhas retornadas pelos filtros da exportacao. Eles nao representam, por si so, toda a execucao orcamentaria municipal nem uma conclusao sobre gasto, regularidade ou desempenho.

## Pipeline implementado

1. `npm run db:bootstrap:lai` registra a fonte e o dataset candidato.
2. `npm run db:ingest:lai -- --input <arquivo.zip>` calcula o checksum do ZIP, extrai o JSON, decodifica Windows-1252 e normaliza campos e totais.
3. O artefato, a execucao, os filtros e um evento `candidate` sao registrados no PostgreSQL local.
4. A reexecucao com o mesmo artefato e configuracao reutiliza a execucao anterior, sem duplicar evento ou evidencia.

## Resultado de persistencia

- `artifact_id`: `5e708445-227c-4f96-95ac-0a6c63c218b1`.
- `run_id`: `617e68eb-1411-49d8-9dd4-a554a2df1891`.
- `event_id`: `694dfbe4-b5b6-48fd-8d37-6fe6371bb209`.
- Duas execucoes do mesmo comando retornaram os mesmos identificadores na segunda execucao (`reused: true`).

## Limites

- A exportacao e uma visao agregada por programa, acao e orgao responsavel; nao substitui empenhos individuais.
- O arquivo depende de exportacao pelo portal; coleta recorrente so sera avaliada depois de revisar termos e mecanismo publico de download.
- O parser nao aceita ausencia de campos essenciais e arredonda totais monetarios para centavos.
