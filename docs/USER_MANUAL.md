# Manual de uso local

## O que esta disponivel hoje

O projeto ainda **nao possui portal web publico, login, API publica ou painel de consultas**. Nesta etapa ele oferece tres formas locais de verificacao:

1. uma pagina de diagnostico no navegador;
2. comandos de banco para conferir a cadeia de dados F1/F2;
3. um servidor MCP por `stdio`, para ser conectado a um cliente MCP compativel.

A pagina local e os comandos abaixo sao ferramentas de desenvolvimento. Eles nao tornam os dados publicos nem substituem a fonte oficial.

## Requisitos

- Node.js 18 ou superior;
- npm;
- Docker Desktop, para o PostgreSQL local;
- clone deste repositorio.

No PowerShell, entre na pasta do repositorio e instale as dependencias:

```powershell
npm install
Copy-Item .env.example .env
```

O arquivo `.env` usa, por padrao, um banco local em `localhost:55433`. A senha de exemplo e exclusiva para desenvolvimento local.

## Primeiro teste: pagina de diagnostico e demonstracao

Inicie o servidor HTTP local:

```powershell
npm run demo:start
```

Abra no navegador:

```text
http://localhost:3000/
```

A pagina confirma que o processo esta ativo. Para ver a resposta tecnica em JSON, abra:

```text
http://localhost:3000/health
```

O resultado esperado e `status: "ok"` e a lista de ferramentas MCP carregadas. Use `Ctrl+C` no terminal para encerrar o processo. Este endpoint nao consulta nem publica o banco.

Com o banco local preparado, abra tambem:

```text
http://localhost:3000/demo
```

Essa e a demonstracao web local e somente leitura. Ela apresenta catalogo, entidades, evidencias e limitacoes; nao e portal publico.

Quando houver uma exportacao LAI processada, a mesma tela tambem mostra o resumo de previsto e realizado com periodo, filtros e checksum.

## Perguntas guiadas na demonstracao

No topo de `http://localhost:3000/demo`, use o campo de pergunta. Nesta etapa, ele responde somente consultas verificaveis sobre os dados locais carregados; nao e um chat de IA livre.

Exemplos:

- `Qual a populacao de Itapevi?`
- `Quanto foi previsto e realizado?`
- `O que ha do TCESP em 2019?`
- `Qual o maior gasto TCESP?`
- `Quais entidades estao em revisao?`

Cada resposta informa cobertura e confianca. A pergunta sobre maior gasto descreve apenas o maior grupo agregado do mes historico coletado; ela nao indica irregularidade, favorecimento ou comportamento em outros periodos.

## Segundo teste: banco local e fluxo F1/F2

Com Docker Desktop em execucao, suba o banco e aplique as migracoes:

```powershell
docker compose up -d
npm run db:migrate
```

Para criar somente o catalogo minimo da F1:

```powershell
npm run db:bootstrap:f1
```

O piloto completo da LOA requer o artefato local e os passos registrados em [F1 - experimento Docling](F1_DOCLING_EXPERIMENT_LOA_2026.md). Ele e propositalmente local e controlado, pois os termos da fonte ainda governam qualquer redistribuicao.

Depois de o piloto F1 e o bootstrap F2 terem sido executados, consulte a cadeia auditavel de entidades:

```powershell
npm run db:inspect:f2
```

O comando mostra, em JSON, o nome canonico quando aceito, o alias observado, status, confianca, fonte, dataset, checksum do artefato e pagina/secao de origem. Um alias `needs_review` e uma pendencia de revisao humana, nao um erro a ser corrigido por inferencia automatica.

Para listar os datasets registrados, sua cobertura e o estado de termos:

```powershell
npm run db:catalog
```

## Terceiro teste: servidor MCP

Compile o projeto e inicie o transporte MCP:

```powershell
npm run build
npm start
```

O servidor MCP usa `stdio`; por isso ele nao abre uma porta ou uma tela. Ele deve ser iniciado por um cliente MCP compativel. A configuracao generica do cliente deve apontar para o Node e para o arquivo compilado:

```json
{
  "command": "node",
  "args": ["C:\\caminho\\para\\Itapevi-em-Dados\\dist\\server.js"],
  "env": {
    "DATABASE_URL": "postgresql://itapevi:itapevi_dev_only@localhost:55433/itapevi_em_dados"
  }
}
```

Use o caminho real do seu clone. A tela e o local exato dessa configuracao dependem do cliente MCP escolhido. Nesta fase, trate como experimentais as ferramentas de fontes externas e nao use respostas de ferramentas classificadas como mock/placeholder como evidencia publica; veja [Status do prototipo](PROTOTYPE_STATUS.md).

## Testes para quem desenvolve

```powershell
npm run build
npm test
git diff --check
```

## Onde encontrar cada coisa

| Necessidade | Caminho atual |
|---|---|
| Confirmar que a aplicacao iniciou | `http://localhost:3000/` |
| Abrir demonstracao local | `http://localhost:3000/demo` |
| Confirmar as ferramentas carregadas | `http://localhost:3000/health` |
| Conferir evidencias F2 no banco | `npm run db:inspect:f2` |
| Listar datasets, cobertura e termos | `npm run db:catalog` |
| Usar ferramentas por IA/cliente | servidor MCP via `npm start` |
| Entender limites do produto | [Status do prototipo](PROTOTYPE_STATUS.md) |
| Acompanhar etapas e backlog | [Plano](DEVELOPMENT_PLAN.md) e [Backlog](BACKLOG.md) |

## Limites

- O acesso HTTP e somente diagnostico local; nao e interface de consulta publica.
- O PostgreSQL local e ambiente de desenvolvimento, nao producao.
- Fontes, documentos e dados derivados possuem regras proprias de uso e redistribuicao.
- Uma interface de consulta para usuarios sera tratada como entrega de produto em etapa posterior, com decisao de escopo, seguranca e revisao humana.
