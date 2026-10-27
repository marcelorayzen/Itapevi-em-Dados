# F2 - Validacao de resolucao de entidades

## Objetivo e limite

Esta validacao exercita somente o recorte aprovado para orgaos e secretarias municipais. Ela ocorreu no PostgreSQL local de desenvolvimento; nao publica dados, aliases ou inferencias.

O artefato de origem e a LOA 2026 ja registrada no catalogo interno, identificada pelo SHA-256 `D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032`.

## Casos validados em 27/10/2026

| Caso | Resultado | Rastreabilidade |
|---|---|---|
| `SECRETARIA DE GOVERNO` | Aceito como alias de `Secretaria de Governo`; a diferenca e somente de caixa. | artefato LOA 2026, pagina 51, secao `orgao_orcamentario`; verificacao Docling e texto extraido do PDF |
| `SECRETARIA DES. URBANO ORDENACAO DO SOLO` | Mantido como `needs_review`; nao houve criacao de entidade nem fusao. | artefato LOA 2026, pagina 82, secao `orgao_orcamentario`; verificacao Docling |

O segundo caso possui uma expansao possivel para a abreviacao `DES.`, mas ela nao foi confirmada por uma segunda fonte oficial. A proposta de nome canonico permanece apenas como dado de revisao e nao como fato aceito.

## Persistencia e auditoria

A migracao `003_entity_resolution.sql` criou:

- `entities`, para a identidade canonica aceita;
- `entity_aliases`, com o texto observado, artefato, localizador, confianca e status;
- `entity_resolution_decisions`, com tipo de decisao, justificativa e responsavel tecnico.

O bootstrap `npm run db:bootstrap-loa-entities` foi executado duas vezes no mesmo banco local. As duas execucoes retornaram os mesmos identificadores e a verificacao final permaneceu em:

| Medida | Resultado |
|---|---:|
| Entidades aceitas | 1 |
| Aliases registrados | 2 |
| Decisoes registradas | 2 |
| Aliases em `needs_review` | 1 |

Assim, a reexecucao nao duplicou registros. O alias pendente continua sem `entity_id`, impedindo que uma hipotese de expansao seja tratada como identidade confirmada.

## Verificacoes executadas

- `npm run build`: aprovado.
- `npm test`: 5 suites e 7 testes aprovados.
- `npm run db:migrate`: migracao `003_entity_resolution.sql` aplicada no PostgreSQL local.
- `npm run db:bootstrap-loa-entities` (duas vezes): aprovado e idempotente.

## Limites

- Esta prova nao faz resolucao de empresas, pessoas, mandatos, contratos ou conduta.
- Nao substitui validacao humana quando houver abreviacao, homonimia ou mudanca institucional.
- O dado continua sujeito aos termos da fonte; esta validacao nao autoriza redistribuicao.
