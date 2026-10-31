# API publica de perguntas — Cloudflare Worker

## Objetivo

A API publica permite que o portal encaminhe perguntas livres sem utilizar o servidor Rayzen. A primeira versao responde somente perguntas cobertas por dados oficiais publicados e devolve evidencia, cobertura e limitacoes.

## Enderecos

| Endereco | Finalidade | Estado em 31/10/2026 |
|---|---|---|
| https://api-dados.rayzen.com.br/health | Diagnostico publico | Endpoint tecnico publico do Worker |
| POST /v1/ask | Pergunta publica em JSON | Worker publicado e validado via HTTP enquanto HTTPS e emitido |

## Primeiro catalogo real

A primeira pergunta publicada e a estimativa populacional de Itapevi. A API consulta o indicador 29171 do IBGE para o municipio 3522505 e retorna:

- ano de referencia;
- populacao retornada pela serie;
- URL da consulta oficial;
- momento da coleta;
- cobertura e limitacoes.

Perguntas sem dataset publicado retornam not_available. A API nao infere, completa ou acusa pessoas, empresas, contratos ou orgaos.

## Contrato

Requisicao:

```json
{ "question": "Qual e a populacao de Itapevi?" }
```

Resposta bem-sucedida inclui answer, data, evidence, coverage, limitations, confidence e metadata.

## Seguranca e limites

- aceita somente origem do portal publico;
- aceita perguntas entre 3 e 500 caracteres;
- nao recebe login, documentos, chaves ou dados pessoais;
- nao possui modelo generativo nesta primeira versao;
- depende da disponibilidade do servico oficial do IBGE;
- novas fontes so entram apos revisao de termos, proveniencia e cobertura.

## Validacao inicial

- testes locais: pergunta de populacao e pergunta indisponivel aprovadas;
- validacao sem deploy: bundle Worker gerado com sucesso;
- validacao publicada via HTTP: pergunta de populacao retornou 243.967 habitantes para 2026, com fonte IBGE; pergunta de licitacoes retornou not_available;
- a integracao do portal usa o subdominio tecnico api-dados.rayzen.com.br, separado do endereco publico do portal.

## Proximas etapas

1. Confirmar certificado HTTPS da API e conectar o campo de pergunta do portal.
2. Inserir protecao de abuso/rate limiting na borda.
3. Publicar novos datasets reais somente apos liberacao documentada.
4. Evoluir para interpretacao por IA citavel, sem permitir resposta sem evidencias.

