# Manual de uso local

## O que esta disponivel hoje

O projeto possui portal e API públicos para recortes aprovados, além de ferramentas locais de desenvolvimento. O portal público é `https://itapevi-em-dados.rayzen.com.br` e não exige login.

1. um portal público de consulta com fontes, período, cobertura e limites;
2. uma página local de diagnóstico no navegador;
3. comandos de banco para conferir a cadeia de dados F1/F2;
4. um servidor MCP por `stdio`, para ser conectado a um cliente MCP compatível.

A página local e os comandos abaixo são ferramentas de desenvolvimento. Eles não substituem a fonte oficial. O endereço `/demo` é um console técnico; a interface destinada ao público é o portal institucional no domínio acima.

## Consultar o portal público

Abra `https://itapevi-em-dados.rayzen.com.br`, conclua a verificação de segurança quando ela for exibida e escreva uma pergunta de até 500 caracteres. Não é necessário criar conta.

Exemplos atualmente cobertos:

- `Qual é a população de Itapevi?`
- `Quais órgãos recebem orçamento?`
- `Quanto foi realizado pela Secretaria de Saúde?`
- `Quantas licitações constam nos recortes publicados?`
- `Quanto foi pago ao pronto-socorro em janeiro de 2026?`

Cada resposta deve trazer a conclusão descritiva, fonte, dataset, checksum, período, cobertura e limites. Perguntas fora da cobertura publicada, que exijam outro período ou que façam acusações recebem uma explicação de indisponibilidade; elas não são completadas por inferência.

Use **Ver trilha de auditoria** abaixo de cada resposta factual para abrir a fonte oficial, ver o identificador da origem, o dataset, o checksum e as instruções para refazer a consulta. O procedimento completo está em [Trilha de auditoria pública](PUBLIC_AUDIT_TRAIL.md).

Na consulta orçamentária por órgão, o recorte público atual cobre 01/09/2026 a 30/09/2026. A lista de órgãos representa somente as linhas retornadas pelo painel nesse período. Veja [Validação N3 da cobertura orçamentária](NATURAL_LANGUAGE_PILOT_N3_VALIDATION.md).

Para contribuir com a avaliação do portal, envie uma pergunta real anonimizável, a expectativa e a dificuldade encontrada para `marcelo.rayzen@live.com`. O procedimento de revisão e o formato de coleta estão no [protocolo N4](NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md).

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
- `Qual a execucao orcamentaria por orgao/programa?`
- `Quanto foi comprado por modalidade de licitacao?`

Cada resposta informa cobertura e confianca. A pergunta sobre maior gasto descreve apenas o maior grupo agregado do mes historico coletado; ela nao indica irregularidade, favorecimento ou comportamento em outros periodos.

Perguntas que pedem acusacao de fraude, irregularidade, favorecimento, culpa ou ilegalidade nao sao respondidas como conclusoes. A demonstracao explica esse limite e aceita somente consultas descritivas e verificaveis; veja [a validacao do ADR-011](F4_NON_ACCUSATORY_VALIDATION.md).

A consulta de compras por modalidade usa somente totais e agrupamentos presentes em uma exportacao local do painel LAI. Ela nao exibe processos, objetos, fornecedores ou documentos brutos e nao representa, sem metadados de filtro, toda a contratacao municipal.

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

Para conferir, com credencial de leitura, a cobertura que já chegou às visões públicas do Neon:

```powershell
$env:DOTENV_CONFIG_PATH = '.env.production.local'
npm run db:inspect:public-coverage
Remove-Item Env:DOTENV_CONFIG_PATH
```

O resultado apresenta somente totais, meses e checksums das visões públicas. Ele não exibe artefatos brutos nem credenciais.

### Ingerir a exportacao de compras por modalidade

Com a exportacao ZIP salva localmente e o PostgreSQL iniciado:

```powershell
npm run db:bootstrap:lai-procurement
npm run db:ingest:lai-procurement -- --input "C:\\caminho\\para\\compras-por-modalidade.zip"
```

O comando registra o checksum do ZIP, mas nao move o arquivo para o repositorio nem o envia ao Git. Veja a cobertura e as limitacoes em [Validacao da exportacao de compras](F1_LAI_PROCUREMENT_EXPORT_VALIDATION.md).

### Converter um lote do Diário Oficial com Docling

Para PDFs extensos, processe um intervalo curto de páginas por vez. Isso torna o uso de memória, a duração e a qualidade de cada lote verificáveis:

```powershell
.\.venv-docling\Scripts\python.exe scripts\docling_extract.py `
  --input "C:\Users\marce\Downloads\1612.pdf" `
  --output-dir ".local\docling\diario-oficial-1612-pages-1-3" `
  --page-start 1 `
  --page-end 3
```

O processo não baixa nem publica documentos. Markdown e JSON ficam somente em `.local`. Antes de usar um trecho como dado público, confira a página original: a conversão pode conter falhas de leitura, codificação ou layout. O estado técnico e as limitações da edição 1612 estão em [Validação do Diário Oficial](F1_DAILY_OFFICIAL_SOURCE_VALIDATION.md).

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

## Relatório semanal de alertas

Para revisar novas coletas, falhas de processamento e pendências de governança no PostgreSQL local:

```powershell
npm run alerts:weekly
```

O relatório é direcionado a Marcelo e Rayzen, é gerado somente sob demanda e não envia mensagens externas. Consulte [Relatório semanal de alertas](F4_WEEKLY_ALERT_REPORT.md) para critérios, limites e revogação.

## Prévia privada de API (histórica)

A rota `GET /api/preview/v1/catalog` foi uma alternativa preparada antes da publicação atual. Ela continua desligada e não é utilizada pelo portal público. Não ative nem distribua chaves sem nova decisão operacional, termos revisados, allowlist aprovada e responsável definido. Veja [Prévia privada de API](F3_PRIVATE_PREVIEW_VALIDATION.md) para o registro histórico e [API pública atual](F3_PUBLIC_API_WORKER.md) para a rota em uso.

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
- A interface de consulta para usuários está publicada no portal institucional. Ela permanece limitada aos recortes oficialmente carregados, com hospedagem, segurança e revisão de cobertura documentadas em [Experiência do portal e demonstração](PRODUCT_PORTAL_EXPERIENCE.md).
