# F1 - Validação da exportação LAI de compras por modalidade

## Amostra controlada

- **Fonte:** Prefeitura do Município de Itapevi, painel `LAI - Compras por Tipo Licitação - Resumo`.
- **Artefato local:** ZIP fornecido pelo decisor em 27/10/2026; não versionado no Git.
- **Checksum SHA-256:** `05AF54BFC655F71AB326239BBC69601AC6479FAD37031672F6B72AAFC8154B47`.
- **Formato:** ZIP contendo CSV Windows-1252, delimitado por `|`.
- **Cobertura observada:** 117 registros de detalhe e uma linha `TOTAL`; o arquivo não declara filtro, período nem data de exportação em metadados.

## Processamento aprovado para o piloto

O normalizador `src/normalization/lai-procurement.ts` valida valores numéricos e produz somente:

- quantidade de registros;
- totais de registro de preço, valor comprado, valor estimado e itens;
- agrupamento por modalidade de licitação.

Números de processo, processos administrativos e objetos/serviços continuam apenas no CSV bruto local. O evento derivado não os replica. O artefato fica com `retained_local` e `blocked_pending_terms_review`.

## Rastreabilidade e reprocessamento

O comando abaixo registra o catálogo e ingere o arquivo de forma idempotente:

```powershell
npm run db:bootstrap:lai-procurement
npm run db:ingest:lai-procurement -- --input "C:\\caminho\\do\\arquivo.zip"
```

O processador é `lai-procurement-normalizer@lai-procurement-v1`. Uma nova execução com o mesmo artefato, configuração e versão reutiliza a execução concluída, sem criar novo evento.

## Limites

- A exportação é um recorte do painel; como não há metadados de filtro no CSV, ela não deve ser apresentada como cobertura completa de um exercício.
- A condição de redistribuição da fonte continua `pending_review`.
- Totais e modalidades são descritivos; não demonstram irregularidade, favorecimento ou responsabilidade de pessoas ou empresas.
