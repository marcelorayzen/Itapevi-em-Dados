# Decisão do piloto F1 — Document Intelligence

- **Data:** 25/10/2026
- **Decisor:** Marcelo Augusto
- **Status:** Aprovada para planejamento; implementação condicionada à validação de fonte e termos.

## Escopo

O fluxo vertical piloto da F1 usará **Diário Oficial** e **emendas parlamentares de Itapevi** para validar Document Intelligence, proveniência e eventos estruturados. O **IBGE** permanece como fonte estruturada complementar de indicadores territoriais e demográficos.

## Roteamento de ingestão

| Fonte | Entrada preferencial | Tratamento |
|---|---|---|
| IBGE | API/JSON/CSV | Normalização direta; não usar Docling sem necessidade documental. |
| Diário Oficial | PDF ou HTML | Preservar original; usar Docling para PDF/documento complexo e normalização direta para HTML estruturado. |
| Emendas parlamentares | PDF, planilha, portal ou API | Normalização direta para dados estruturados; Docling para PDF, anexos e imagens digitalizadas. |

## Saída mínima do piloto

- artefato original, checksum, URL e data de coleta;
- documento normalizado em estrutura navegável;
- metadados de edição/página ou equivalente;
- evento/fato candidato com evidência apontando à origem;
- extração de título, seção/artigo, tabela, data, valor, órgão, autor quando houver e referência documental.

Consulte também a [especificação de Document Intelligence](F1_DOCUMENT_INTELLIGENCE_SPEC.md), que define os campos candidatos e a regra cautelosa de vínculo entre emenda e execução.

## Limites

Esta decisão não autoriza scraping, redistribuição ou publicação de dados derivados sem validar a fonte, os termos aplicáveis e a responsabilidade institucional.
