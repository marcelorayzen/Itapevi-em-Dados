# F1 - Estimativa IBGE 2026

A planilha oficial `estimativa_dou_2026.xlsx` foi mantida em `.local/` e registrada somente no PostgreSQL local.

- Fonte: IBGE, estimativas municipais com referencia em 01/07/2026.
- SHA-256: `6D512A1E48506FBBFA252BA407AABC2160B07329FA652411EF7D39BD63F49284`.
- Itapevi: codigo IBGE `3522505`, populacao estimada `243967`.
- `artifact_id`: `eec4bef4-d406-4aee-b8c6-faf6de1cce15`.
- Duas execucoes reutilizaram o mesmo `run_id`, sem duplicacao.

O extrator Python usa `openpyxl 3.1.5`; o adaptador Node registra artefato, execucao, evidencia e evento `candidate`. O arquivo nao foi versionado nem publicado. Termos de redistribuicao continuam pendentes de revisao.

## Conector MCP validado

Em 29/10/2026, a ferramenta MCP `dados_ibge` foi corrigida para usar somente as rotas oficiais que responderam na validacao:

- municipio: `GET /api/v1/localidades/municipios/3522505`;
- estimativa populacional: `GET /api/v1/pesquisas/indicadores/29171/resultados/3522505`.

A resposta real retornou a estimativa de **243.967 habitantes em 2026**. O conector deixou de consultar as rotas antigas de estatisticas e PIB, pois elas retornaram erro ou nao foram validadas. Area territorial, densidade e PIB nao sao mais afirmados pela ferramenta ate haver fonte oficial especifica, versao e cobertura revisadas.
