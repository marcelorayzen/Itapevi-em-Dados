# F2 - Avaliacao de projecao relacional e necessidade de grafo

## Pergunta avaliada

Para cada alias de orgao/secretaria extraido da LOA, qual e a identidade aceita, qual artefato a sustenta e em qual pagina/secao ela aparece?

## Consulta relacional implementada

O comando `npm run db:inspect:f2` executa uma consulta PostgreSQL que percorre:

```text
entity_aliases -> entities (quando aceito)
               -> artifacts -> datasets -> sources
```

O resultado preserva alias, status de resolucao, confianca, fonte, dataset, checksum e localizador. Tambem retorna aliases em `needs_review` sem inventar uma entidade canonica.

## Resultado da prova local em 27/10/2026

Com o piloto LOA 2026, a consulta retornou dois aliases:

| Estado | Resultado |
|---|---|
| Aceito | `SECRETARIA DE GOVERNO` ligado a `Secretaria de Governo`, com pagina 51 e fonte rastreavel. |
| Pendente | `SECRETARIA DES. URBANO ORDENACAO DO SOLO`, sem entidade vinculada e com `needs_review`, pagina 82. |

A consulta foi respondida integralmente por `JOIN`s indexados no PostgreSQL. Nao houve caminhos variaveis, comunidades, travessias multi-salto ou volume que justificassem uma segunda infraestrutura.

## Decisao desta etapa

O Knowledge Graph **nao esta justificado ainda**. PostgreSQL permanece como fonte de verdade e tambem como mecanismo de consulta para este recorte.

Esta decisao atende ao ADR-003: um grafo somente sera proposto quando uma pergunta real nao puder ser atendida de forma adequada por consultas convencionais, considerando desempenho, explicabilidade e custo operacional.

## Gatilhos para reavaliacao

Reavaliar a projecao em grafo somente quando houver dados aceitos suficientes para uma pergunta com caminhos publicamente citaveis, por exemplo Empresa -> Licitacao -> Contrato -> Secretaria, e quando a comparacao demonstrar limite concreto da consulta relacional.

## Limites

- O resultado nao constitui grafo, GraphRAG ou inferencia automatica.
- Esta prova nao confirma relacoes entre empresas, pessoas, contratos ou conduta.
- Nenhum dado do piloto foi publicado por este comando.
