# Itapevi em Dados

Plataforma em desenvolvimento para transformar dados publicos municipais em consultas compreensiveis, verificaveis e rastreaveis. O projeto nao substitui os portais oficiais: cada resposta precisa conservar a fonte, o periodo, a cobertura e as evidencias que permitem sua verificacao.

O codigo esta sob [Apache-2.0](LICENSE). Isso nao concede licenca sobre dados, documentos, PDFs, APIs ou dados derivados de terceiros. Cada fonte possui termos e condicoes proprios, registrados antes de qualquer redistribuicao.

## Para que serve

O objetivo e apoiar cidadania, controle social e gestao publica com uma experiencia que permita:

- explorar execucao orcamentaria e compras por recortes declarados;
- entender o que cada indicador cobre e o que ele nao permite concluir;
- navegar da resposta ate fonte, artefato, periodo e criterio utilizados;
- apresentar informacoes de forma descritiva e nao acusatoria;
- evoluir de Itapevi para outras cidades sem duplicar o nucleo de governanca.

O produto nao declara fraude, irregularidade, favorecimento ou culpa. Indicadores de atencao sao descritivos, reproduziveis e vinculados a fontes e criterios; consulte [ADR-011](docs/architecture/adr/ADR-011-non-accusatory-public-insights.md).

## Estado verificado em 29 de outubro de 2026

| Componente | Estado | Limite importante |
|---|---|---|
| Catalogo, proveniencia, evidencias e eventos | Implementado no PostgreSQL local | Nao e ambiente de producao |
| Ingestoes locais controladas (IBGE, LAI, compras LAI, LOA e piloto TCESP) | Implementadas e testadas | Termos de redistribuicao ainda estao em revisao humana |
| Consulta guiada, insights de execucao e alertas semanais | Implementados localmente | Alertas nao sao enviados automaticamente |
| Console `/demo` | Implementado | E uma ferramenta tecnica, nao o portal do usuario |
| Previa privada de API | Preparada, desligada por padrao | Sem deploy externo e sem datasets liberados |
| Portal de apresentacao ao publico/instituicoes | Planejado | Depende da decisao de dados demonstrativos e hospedagem |

O [Status do prototipo](docs/PROTOTYPE_STATUS.md) e a [documentacao V2](docs/README.md) detalham o que esta implementado, testado, planejado ou bloqueado.

## Como testar hoje

### 1. Ambiente local controlado

Requisitos: Node.js 18+, npm e Docker Desktop.

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d
npm run db:migrate
npm run db:bootstrap:f1
npm run demo:start
```

Abra `http://localhost:3000/demo`. Essa tela confirma catalogo, evidencias e consultas guiadas em ambiente local. Ela nao deve ser usada como portal publico.

Para validar o codigo:

```powershell
npm run build
npm test
git diff --check
```

O [Manual de uso local](docs/USER_MANUAL.md) traz comandos, resultados esperados, perguntas guiadas, limites e procedimentos de diagnostico.

### 2. Demonstracao institucional

O projeto tera duas modalidades separadas:

| Modalidade | Finalidade | Dados permitidos |
|---|---|---|
| Demo publica estatica (por exemplo, GitHub Pages) | Apresentar a proposta, fluxo de consulta e metodo | Conteudo sintetico ou explicitamente liberado |
| Previa privada em subdominio | Validacao por convidados de uma versao proxima ao produto | Apenas agregados/datasets aprovados, com autenticacao e logs |

GitHub Pages e adequado para uma demonstracao estatica e segura, mas nao para expor o PostgreSQL local, credenciais, documentos brutos ou dados ainda `pending_review`. Um subdominio de testes faz sentido depois de definir provedor, responsavel operacional, publico, dominio, dados liberados e ApprovalGate humano. A [especificacao do portal](docs/PRODUCT_PORTAL_EXPERIENCE.md) descreve a decisao e o roteiro de testes.

A demonstracao estatica fica em `public-demo/` e o workflow de Pages esta pronto. A ativacao do Pages no repositorio continua sendo uma configuracao administrativa do GitHub. A preparacao do subdominio privado esta detalhada em [Previa privada em subdominio](docs/PRIVATE_PREVIEW_DEPLOYMENT.md).

A demonstracao publica esta disponivel em [itapevi-em-dados.rayzen.com.br](https://itapevi-em-dados.rayzen.com.br/). A pergunta sobre populacao consulta a fonte oficial do IBGE em tempo real; os demais indicadores visuais permanecem ilustrativos ate suas fontes serem liberadas. Veja o [registro de publicacao](docs/PUBLIC_DEMO_DEPLOYMENT.md).

## Dados, confianca e licencas

Cada fonte deve registrar origem, data de coleta, artefato, checksum, termos, condicao de uso e nivel de confianca. "Dado publico" nao significa automaticamente que pode ser redistribuido por este projeto.

- [Registro de fontes e datasets](docs/DATA_SOURCES_REGISTER.md)
- [Revisao de termos e licencas](docs/P0_DATA_LICENSE_REVIEW.md)
- [Governanca de dados](docs/DATA_GOVERNANCE.md)
- [Checklist de seguranca e release](docs/SECURITY_AND_RELEASE_CHECKLIST.md)

O BBSIA pode apoiar a revisao institucional e de governanca, desde que a conclusao seja registrada por escrito. Pesquisa em fontes oficiais na internet ajuda a localizar termos e atribuir fontes, mas nao substitui confirmacao do detentor da fonte, responsavel institucional ou parecer juridico quando os termos forem ambiguos.

## Documentacao principal

- [Visao do produto](docs/vision.md) e [principios](docs/principles.md)
- [Plano de desenvolvimento](docs/DEVELOPMENT_PLAN.md) e [backlog](docs/BACKLOG.md)
- [Experiencia do portal e demonstracao](docs/PRODUCT_PORTAL_EXPERIENCE.md)
- [Manual de uso local](docs/USER_MANUAL.md)
- [Integracao e avaliacao BBSIA](docs/BBSIA_INTEGRATION.md)
- [Pedido de avaliacao institucional ao BBSIA](docs/BBSIA_REVIEW_REQUEST.md)
- [Previa privada em subdominio](docs/PRIVATE_PREVIEW_DEPLOYMENT.md)
- [Publicacao da demonstracao estatica](docs/PUBLIC_DEMO_DEPLOYMENT.md)
- [Arquitetura, ADRs e especificacoes](docs/README.md)

## Estrutura resumida

```text
Fontes oficiais -> coleta controlada -> artefatos/evidencias
                     -> normalizacao -> PostgreSQL (fonte de verdade)
                     -> consultas e insights explicaveis
                     -> portal, API e MCP
```

O grafo de conhecimento e uma projecao futura, somente se a consulta relacional convencional deixar de ser suficiente. Ele nunca substitui os fatos, artefatos ou evidencias de origem.

## Contribuir

Antes de abrir uma contribuicao, leia o [plano](docs/DEVELOPMENT_PLAN.md), os [ADRs](docs/architecture/adr/) e as regras de dados. Alteracoes em conectores precisam preservar proveniencia, termos, testes e limites de cobertura. Nao inclua artefatos brutos, credenciais ou dados sem condicao de redistribuicao confirmada no Git.

## Contato

- Autor: Marcelo Augusto
- Projeto: Rayzen Gov
- GitHub: <https://github.com/marcelorayzen>
