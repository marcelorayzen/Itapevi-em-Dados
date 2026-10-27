# F1 — Normalização controlada da LOA 2026

## Objetivo e escopo

Validar uma normalização mínima e conservadora da LOA 2026 antes de gerar eventos ou indicadores. O resultado é um **candidato**, não um fato público publicado.

## Referência manual

| Página | Conteúdo conferido | Resultado |
|---|---|---|
| 1 | identificação da lei, data, título e Art. 1º | recuperado pelo Docling e corroborado por extração textual direta do PDF |
| 2 | exercício, Art. 2º e os três totais declarados | recuperado pelo Docling e corroborado por extração textual direta do PDF |
| 2 a 5 | primeiras tabelas orçamentárias | não aceitas para normalização nesta etapa |

O PDF possui 341 páginas. A confirmação independente usou texto extraído diretamente das páginas 1 e 2 do PDF local, além da saída Docling. Não foram versionados trechos, valores ou tabelas derivados.

## Esquema normalizado

`src/normalization/loa.ts` produz um `municipal_budget_law` com:

- número e data da lei;
- exercício;
- título;
- total geral, orçamento fiscal e orçamento da seguridade social;
- localizadores lógicos: `lei_header`, `artigo_1`, `artigo_2` e seus incisos.

O resultado recebe estado `candidate`. A aceitação como evento dependerá da persistência de evidências de página e da etapa F1-05.

## Limitações aplicadas

- O normalizador não lê tabelas, funcional programática, emendas, despesas ou relações entre elas.
- As 76 advertências de correspondência de célula do Docling impedem que tabelas sejam usadas como fatos sem referência manual adicional.
- O arquivo normalizado real permanece em `.local/`; os testes versionados usam somente dados sintéticos.

## Verificação

- 3 testes unitários cobrem extração, rejeição de entrada incompleta e moeda brasileira.
- A execução local sobre a LOA real produziu um candidato coerente com a referência manual.
- Build e suíte de testes passaram após a inclusão do normalizador.
