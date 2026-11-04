# API publica de perguntas — Cloudflare Worker

## Objetivo

A API publica permite que o portal encaminhe perguntas livres sem utilizar o servidor Rayzen. A primeira versao responde somente perguntas cobertas por dados oficiais publicados e devolve evidencia, cobertura e limitacoes.

## Enderecos

| Endereco | Finalidade | Estado em 03/11/2026 |
|---|---|---|
| https://api-dados.rayzen.com.br/health | Diagnostico publico | Endpoint tecnico publico do Worker |
| https://api-dados.rayzen.com.br/v1/ask | `POST` de pergunta pública em JSON | Worker publicado com HTTPS; o portal é o cliente público previsto. |

## Catalogo publico atual

O catálogo reúne somente recortes com fonte e limites explícitos: estimativa populacional do IBGE, totais agregados de contratos e licitações, execução orçamentária por órgão no período publicado e pagamentos mensais com vínculo explícito a pronto-socorro ou SAMU. A estimativa populacional consulta o indicador 29171 do IBGE para o município 3522505. A API retorna:

- ano de referencia;
- populacao retornada pela serie;
- URL da consulta oficial;
- momento da coleta;
- cobertura e limitacoes.

Perguntas sem dataset publicado retornam `not_available`. A API não infere, completa ou acusa pessoas, empresas, contratos ou órgãos. Uma pergunta genérica sobre órgãos orçamentários retorna a listagem do recorte publicado; ela não escolhe um órgão pelo maior valor.

## Contrato

Requisicao:

```json
{ "question": "Qual e a populacao de Itapevi?" }
```

Resposta bem-sucedida inclui `answer`, `data`, `evidence`, `coverage`, `limitations`, `confidence` e `metadata`. A evidência identifica fonte, `sourceId`, `datasetId`, URL oficial, checksum e instruções de conferência; o portal apresenta esses elementos em **Ver trilha de auditoria**.

## Seguranca e limites

- aceita somente origem do portal publico;
- aceita perguntas entre 3 e 500 caracteres;
- nao recebe login, documentos, chaves ou dados pessoais;
- o piloto de IA está ativo desde 03/11/2026 com contrato de intenção fechado; o modelo não recebe acesso a SQL, documentos brutos, credenciais ou fatos para redação livre;
- depende da disponibilidade do servico oficial do IBGE;
- novas fontes so entram apos revisao de termos, proveniencia e cobertura.

## Validacao atual

- testes locais cobrem população, respostas indisponíveis, filtros fechados, perguntas acusatórias, orçamento e proteção de rota;
- a visão pública de orçamento retornou 20 órgãos em setembro e 25 em outubro de 2026, com checksum por artefato e sem soma entre meses; veja [Validação temporal de orçamento](R0_BUDGET_TEMPORAL_COVERAGE_VALIDATION_2026-11-03.md);
- o Worker foi empacotado com sucesso antes da publicação e está protegido por Turnstile e limite de requisições;
- a integração do portal usa o subdomínio técnico `api-dados.rayzen.com.br`, separado do endereço público do portal.

## Proximas etapas

1. Concluir a avaliação N4 de 40 perguntas reais anonimizadas durante o piloto e registrar cada falha no backlog.
2. Publicar novos datasets reais somente após liberação documentada.
3. Ampliar filtros e períodos somente quando o recorte correspondente estiver carregado e validado.
4. Manter a interpretação por IA citável, sem permitir resposta sem evidências.

