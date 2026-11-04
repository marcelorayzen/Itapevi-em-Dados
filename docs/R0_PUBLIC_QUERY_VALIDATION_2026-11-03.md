# Registro histórico — validação da consulta pública em 03/11/2026

> Este é um snapshot de uma rodada anterior de validação, com versões de Worker e commits daquela data. Para a cobertura e publicação vigentes, consulte [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md) e [F3_PUBLIC_API_WORKER.md](F3_PUBLIC_API_WORKER.md).

## Objetivo

Registrar o estado verificável do portal público antes da rodada de testes com pessoas externas ao projeto.

## Endereços e versões

- Portal: `https://itapevi-em-dados.rayzen.com.br/`
- API: `https://api-dados.rayzen.com.br/`
- Worker publicado: `5bbe92fc-81b9-4878-b275-6aff5b566c94`.
- CI e deploy do portal para o commit `3d7799b` concluídos com sucesso no GitHub Actions.

## Consultas publicadas

| Tema | Pergunta compatível | Evidência exibida |
|---|---|---|
| População | `Qual é a população de Itapevi?` | IBGE, indicador e ano de referência. |
| Contratos | `Qual secretaria possui maior valor contratado?` | Fonte municipal, dataset, checksum, cobertura e limite. |
| Licitações | `Quantas licitações constam nos recortes publicados?` | Fonte municipal, dataset, checksum, cobertura e limite. |
| Orçamento | `Quanto foi realizado pela Secretaria de Saúde?` | Recorte previsto × realizado por órgão, com período e checksum. |
| Saúde | `Quanto foi pago ao pronto-socorro em janeiro de 2026?` | Empenhos com vínculo explícito, mês, checksum e limite de cobertura. |

## Controles verificados

- Turnstile ativo antes de aceitar perguntas.
- Limite de 10 consultas por minuto.
- Respostas não acusatórias e sem inferência de irregularidade, culpa ou favorecimento.
- Worker consulta apenas visões agregadas públicas do PostgreSQL.
- Dados brutos, ZIPs, PDFs e credenciais não são entregues pela API pública.

## Correções registradas nesta rodada

1. A pergunta sobre empresas vencedoras foi removida das sugestões porque os agregados atuais não sustentam ranking de empresas.
2. A consulta de orçamento passou a respeitar a secretaria solicitada; uma pergunta sobre Saúde não pode retornar Educação.
3. Mensagens de indisponibilidade passaram a descrever o catálogo atual, sem afirmar que somente população está publicada.

## Limites para avaliadores

- Os recortes têm período, filtros e cobertura próprios; ausência de linha não prova ausência de gasto, contrato ou licitação.
- Perguntas fora das consultas publicadas devem receber indisponibilidade explicável, não resposta especulativa.
- A validação humana ainda é necessária para confirmar o fluxo completo de Turnstile no navegador e coletar sugestões de uso.
