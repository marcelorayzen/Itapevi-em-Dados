# N4 - primeiro achado do piloto

**Data:** 03/11/2026  
**Origem:** teste do responsável pelo produto. Este caso não conta como uma das 40 perguntas externas anonimizadas.

## Pergunta observada

> Qual valor recebeu a Secretaria de Administração e Tecnologia?

## Falha identificada

O dado orçamentário estava publicado e a secretaria constava no catálogo, mas a expressão “valor recebeu” não correspondia aos termos determinísticos anteriores. O portal retornava indisponibilidade mesmo havendo um recorte factual aplicável.

## Correção aplicada

O roteador passou a reconhecer `recebeu`, `recebido`, `receber` e `dotação` como formulações de execução orçamentária. Quando esse tipo de pergunta é atendido, a resposta esclarece que a fonte não possui uma métrica denominada “valor recebido” e apresenta, sem inferência, os valores **previsto** e **realizado** do órgão identificado.

## Validação com dados reais

- **Órgão retornado:** Secretaria de Administração e Tecnologia.
- **Previsto:** R$ 8.932.570,96.
- **Realizado:** R$ 117.499,61.
- **Dataset:** `DS-LAI-PREVISTO-EMPENHADO-2026`.
- **Cobertura:** 01/09/2026 a 30/09/2026; filtro por data de empenho.
- **Evidência:** um checksum de artefato retornado pela visão pública.

## Regra para N4

Perguntas derivadas que apontem para dados já publicados devem gerar uma resposta factual com seus limites, ou uma explicação específica da lacuna. Elas não devem receber uma indisponibilidade genérica por falha de vocabulário do roteador. O caso será usado como referência de regressão, mas a avaliação formal continua exigindo 40 perguntas reais anonimizadas, conforme o [protocolo N4](NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md).
