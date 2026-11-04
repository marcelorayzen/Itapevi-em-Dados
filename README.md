# Itapevi em Dados

Observatório público de dados municipais que transforma fontes oficiais dispersas em consultas verificáveis. Cada resposta informa recorte, período, fonte, evidência e limitações.

**Portal público:** [itapevi-em-dados.rayzen.com.br](https://itapevi-em-dados.rayzen.com.br/)

**Estado desta documentação:** para o que está realmente publicado, consulte o [estado atual do produto](docs/CURRENT_PUBLIC_PRODUCT_STATUS.md).

## Capacidades publicadas

| Domínio | Cobertura atual |
|---|---|
| População | Estimativa oficial IBGE de Itapevi. |
| Contratos | Agregados municipais de 2024 a 2026 por secretaria. |
| Licitações | Agregados municipais de 2024 a 2026. |
| Execução orçamentária | Previsto e realizado por órgão/programa no recorte oficial carregado. |
| Urgência e emergência | Empenhos com referência explícita a pronto-socorro ou SAMU, por mês. |

Perguntas fora da cobertura recebem explicação clara sobre a lacuna. O portal não supõe entidade, período, métrica ou vínculo não comprovado.

## Arquitetura

```text
Fontes oficiais → coleta controlada → normalização e reconciliação
→ PostgreSQL: fatos, proveniência e evidências
→ visões públicas agregadas e restritas
→ Cloudflare Worker / Hyperdrive → portal com evidências
```

PostgreSQL é a fonte de verdade. Documentos brutos não são expostos pela API pública. A API usa credencial de leitura limitada a visões agregadas.

## Documentação

- [Estado atual do produto público](docs/CURRENT_PUBLIC_PRODUCT_STATUS.md)
- [Visão de produto](docs/vision.md)
- [Arquitetura](docs/architecture/architecture.md)
- [Capacidades e cobertura](docs/CAPABILITIES.md)
- [Trilha de auditoria pública](docs/PUBLIC_AUDIT_TRAIL.md)
- [Registro de fontes e condições de uso](docs/DATA_SOURCES_REGISTER.md)
- [Modelo de dados](docs/data/ontology.md)
- [Decisões arquiteturais (ADRs)](docs/adr/README.md)
- [Índice completo](docs/README.md)

## Perguntas naturais

O portal aceita perguntas livres dentro da cobertura publicada. O piloto público de IA está **ativo de forma controlada**: o Workers AI interpreta a intenção em um contrato fechado e o Worker consulta somente rotas parametrizadas nas visões públicas. O modelo não cria fatos, não executa SQL livre e não substitui fonte, período, checksum, cobertura ou limitações. Perguntas fora do catálogo recebem uma explicação verificável da lacuna.

## Desenvolvimento

Requer Node.js 18+, npm e Docker Desktop.

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d
npm run db:migrate
npm test
```

Consulte o [manual técnico](docs/USER_MANUAL.md). Credenciais, artefatos brutos e dados locais não devem ser versionados.

## Licença e dados

O código está sob [Apache-2.0](LICENSE). A licença do código não concede direitos sobre dados, documentos, APIs ou artefatos de terceiros. Cada fonte possui registro de origem, condição de uso e evidência associada.
