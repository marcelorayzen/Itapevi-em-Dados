# F3 - Demonstracao web local

## Escopo aprovado

A primeira versao e local, somente leitura e sem login. Ela le exclusivamente o PostgreSQL local; nao faz scraping, nao consulta APIs externas e nao publica dados.

## Como iniciar

```powershell
docker compose up -d
npm run db:migrate
npm run demo:start
```

Abra `http://localhost:3000/demo`.

## O que a demonstracao exibe

- catalogo de datasets, fonte, estado de termos, quantidade de artefatos e escopo;
- aliases de orgaos/secretarias, identidade aceita quando houver, estado de revisao, pagina e dataset;
- cobertura e confianca retornadas pelo contrato `1.0`;
- aviso visivel de que o ambiente e piloto local, sem permissao automatica de redistribuicao.

As rotas somente leitura sao `GET /api/demo/catalog` e `GET /api/demo/entities`. Ambas retornam o contrato comum `1.0`.

## Limites de demonstracao

- Nao ha login, controle de acesso, API publica ou deploy externo.
- A demonstracao nao mostra documentos brutos, nem afirma que dados `needs_review` foram confirmados.
- O uso em reunioes com prefeituras ou BBSIA deve apresentar a cobertura e as limitacoes de cada resultado.
- Qualquer publicacao externa depende de revisao humana de seguranca, termos e conteudo.
