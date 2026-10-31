# F1 — Validação da fonte Diário Oficial de Itapevi

## Fonte confirmada

- Organização: Prefeitura de Itapevi.
- Página de índice: <https://itapevi.sp.gov.br/diario-oficial/>.
- Recurso testado: [Edição 1612](https://itapevi.sp.gov.br/wp-content/uploads/2026/10/1612.pdf), 30/10/2026.
- Regra pública visível na página: a Prefeitura informa que mantém a versão online e orienta selecionar a edição para download.

## Artefato local controlado

O responsável forneceu `1612.pdf` em `Downloads`. O arquivo não foi copiado para o repositório nem publicado pelo projeto.

| Campo | Valor |
|---|---|
| Páginas | 110 |
| SHA-256 | `F62A30BBE6B215FDC76487FC461DA39D4409EAD5C5651464EBABFBE6A30B18CC` |
| Cabeçalho verificado | Ano 18, Edição nº 1612, Itapevi, 30 de outubro de 2026 |
| Primeiro conteúdo estruturado | página 3: Secretaria de Governo → Atos Oficiais → Leis → Lei nº 3.721, de 27 de outubro de 2026 |

## Decisão de processamento

1. Manter o PDF como artefato bruto local com checksum e URL oficial.
2. Extrair metadados da edição, órgãos/seções, atos, números e datas com localizador de página.
3. Não exibir documento integral como resposta do produto; apontar para a URL oficial e evidência citável.
4. Registrar incertezas de leitura e não transformar menções em conclusões sobre pessoas, empresas ou conduta.

## Estado do Docling

O ambiente isolado do Docling está instalado e importa corretamente. A tentativa de conversão integral da edição 1612 não gerou Markdown/JSON nem erro útil no primeiro processamento. Por isso, a leitura textual de `pypdf` é a linha de base verificável para este artefato; R0-14 inclui corrigir ou substituir a execução estrutural do Docling antes de adotá-lo como processo oficial para o Diário.

## Ingestão idempotente

O comando abaixo registra a fonte, dataset, PDF local, checksum, execução, evento e duas evidências de página no PostgreSQL local. O PDF não é copiado.

```powershell
npm run db:ingest:daily-official -- --input C:\Users\marce\Downloads\1612.pdf --source-url https://itapevi.sp.gov.br/wp-content/uploads/2026/10/1612.pdf --edition 1612 --published-on 2026-10-30 --pages 110 --first-content-page 3 --storage-ref C:\Users\marce\Downloads\1612.pdf
```

Uma repetição com os mesmos parâmetros deve reutilizar a execução concluída, sem duplicar evento ou evidências.
