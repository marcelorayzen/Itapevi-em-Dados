# F1 — Experimento Docling: LOA 2026

## Escopo e autorização

- **Data:** 25/10/2026
- **Decisor:** Marcelo Augusto
- **Escopo autorizado:** extração local controlada com dados reais da LOA 2026; sem publicar o PDF, Markdown, JSON ou tabelas derivadas.
- **Fonte:** `SRC-LOA-2026-001`, Prefeitura de Itapevi, Lei nº 3.551/2025.
- **URL de origem:** <https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf>

## Artefato de entrada

| Campo | Valor |
|---|---|
| Tipo | PDF |
| Tamanho | 1.932.653 bytes |
| Páginas extraídas | 341 |
| SHA-256 | `D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032` |
| Retenção | local, fora do Git (`.local/`) |

## Execução

| Campo | Valor |
|---|---|
| Ferramenta | Docling 2.142.1 |
| Script | `scripts/docling_extract.py` |
| OCR | desativado após tentativa inicial ser inadequada para este PDF digital |
| Saídas | Markdown e JSON locais; não versionados |
| Estado | `succeeded` |

## Métricas de saída

| Métrica | Resultado |
|---|---:|
| Blocos de texto | 7.120 |
| Tabelas | 333 |
| Imagens | 1.449 |
| Grupos estruturais | 530 |
| Linhas de Markdown | 11.270 |
| Markdown | 2.215.552 bytes |
| JSON | 27.093.296 bytes |
| Avisos de correspondência de célula | 76 |

Checksums das saídas locais:

- Markdown: `77ADED298110AD74535A7FF33FD077EB172644FF392E199709C78962D77C42FB`
- JSON: `919CB1234EAD23BFBC062A158A3B526EC621061FBA879E61ADE9CDFFDC95B796`

## Avaliação inicial

- A estrutura principal foi recuperada: cabeçalhos, capítulos, seções, artigos e valores orçamentários aparecem no Markdown.
- A execução com OCR foi interrompida: produziu respostas vazias em páginas digitais e custo excessivo. A execução aprovada sem OCR concluiu.
- As 76 advertências indicam que células de tabelas foram descartadas durante a correspondência de grade. Portanto, tabelas extraídas são **candidatas** e não podem alimentar eventos/fatos aceitos sem amostra de referência e revisão manual.
- A LOA não prova, por si só, emendas individualizadas nem execução financeira. Qualquer relação futura entre emenda e despesa permanece não confirmada até haver fontes e evidências adicionais.

## Próximos passos técnicos

1. Definir uma amostra manual de páginas/tabelas críticas para medir fidelidade.
2. Criar persistência de `artifact`, `run` e `evidence` segundo o modelo F1.
3. Localizar anexo oficial de emendas individualizadas e documento de execução para testar a cadeia completa.
