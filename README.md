# Itapevi em Dados — protótipo da plataforma Cidade em Dados

Primeira implementação e protótipo da plataforma **Cidade em Dados**: um servidor MCP em TypeScript/Node.js para consultas a dados públicos de Itapevi (SP). O protótipo não substitui fontes oficiais; respostas e dados devem ser verificados na fonte de origem.

## 📋 Sobre o Projeto

Itapevi em Dados é um servidor MCP que unifica informações de diversas fontes públicas da cidade de Itapevi, permitindo que qualquer pessoa (cidadão, vereador, jornalista, pesquisador) faça perguntas em português e receba respostas baseadas em dados reais.

### Problema que resolve
- Dados públicos existem mas estão espalhados em diferentes portais e formatos
- Cidadãos e gestores têm dificuldade de acessar informações consolidadas
- Decisões políticas muitas vezes são tomadas sem embasamento em dados

### Solução
Um servidor MCP que expõe ferramentas de consulta a:
- ✅ Portal da Transparência da Câmara (despesas, licitações, contratos)
- ✅ Projeto "Pensando em Itapevi" (demandas da população por bairro)
- ✅ Legislação municipal (leis, decretos, projetos)
- ✅ Dados do IBGE (demografia, perfil socioeconômico)
- ✅ (Em breve) Lei de Transparência Imobiliária

## Status do Protótipo

| Estado | Componentes |
|---|---|
| Implementado | Servidor MCP, cache, validação de entradas, health-check e testes iniciais. |
| Experimental | Integrações IBGE, Diário Oficial e MeuMunicípio; dependem de disponibilidade e mudanças nas fontes. |
| Mock ou placeholder | Despesas, legislação, licitações e demandas. Não devem ser usadas como evidência pública. |
| Planejado V2 | Grafo de conhecimento, memória histórica, timeline, provenance/lineage/trust, alertas, portal web e API pública. |

Consulte a [documentação institucional e técnica](docs/README.md) para a distinção detalhada entre estado atual e arquitetura-alvo.

Para instalar, iniciar e testar o protótipo localmente — inclusive a página de diagnóstico disponível no navegador — siga o [Manual de uso local](docs/USER_MANUAL.md).

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ ou Python 3.10+
- npm ou yarn
- (Opcional) Conta no Tavily para buscas avançadas

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marcelorayzen/Itapevi-em-Dados.git
cd Itapevi-em-Dados

# Instale as dependências
npm install
# ou
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

### PostgreSQL local para F1

O PostgreSQL é a fonte de verdade do catálogo, artefatos, execuções e evidências da F1. Para desenvolvimento local, o Compose isola o banco em `127.0.0.1:55433`, evitando interferência com outras instâncias PostgreSQL.

```bash
docker compose up -d
npm run db:migrate
npm run db:bootstrap:f1
```

O valor de `DATABASE_URL` em `.env.example` já aponta para esse ambiente de desenvolvimento. A senha padrão é exclusivamente local; nunca a reutilize em homologação ou produção.

### Distribuição por npm

Este protótipo **não está publicado como pacote npm**. A configuração via `npx itapevi-em-dados` não está disponível. Para executar ou integrar o servidor MCP, clone o repositório, instale as dependências e use os scripts locais descritos abaixo.

## 🛠️ Ferramentas declaradas no protótipo

As ferramentas de despesas, legislação, licitações e demandas estão classificadas como mock ou placeholder no [Status do Protótipo](docs/PROTOTYPE_STATUS.md). Elas não devem ser usadas como evidência pública até que suas fontes e comportamentos sejam validados.

| Ferramenta | Descrição | Parâmetros |
|---|---|---|
| buscar_despesas | Consulta despesas da Prefeitura | ano, mês (opcional) |
| buscar_licitacoes | Lista licitações por período | ano, modalidade (opcional) |
| buscar_demandas_por_bairro | Demandas do "Pensando em Itapevi" | bairro (opcional) |
| buscar_lei | Pesquisa legislação municipal | palavra_chave |
| dados_ibge | Dados demográficos de Itapevi | (nenhum) |
| buscar_contratos | Contratos vigentes | exercicio, contratado (opcional) |
| dados_meumunicipio | Dados do censo 2010 pela MeuMunicipio.org.br | (nenhum) |
| buscar_publicacoes_oficiais | Diário Oficial de Itapevi (Gazeta SP) | palavra_chave, limite |

## 📌 Integração de fontes reais

1. API IBGE (recomendado)
   - `src/tools/ibge.ts` usa o endpoint:
     - `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3522505/estatisticas`
     - `https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-6/variaveis/979?localidades=3522505`
   - Cache de 30 dias em `utils/cache.ts`.
   - Para alterar valores fictícios, ajuste as variáveis locais em `handler()`.
   - Fonte de dados configurável em `.env`:
     - `DATA_SOURCE=ibge` ou `DATA_SOURCE=csv`
     - se CSV, lê `data/itapevi-dados.csv` com colunas `populacao`, `area`, `pib`.

2. MeuMunicipio.org.br (censo 2010)
   - `src/tools/meumunicipio.ts` faz scraping de:
     - `https://meumunicipio.org.br/perfil-municipio/3522505-Itapevi-SP`
   - Para migrar para CSV, use `scripts/download-dados-municipio.ts` e adapte a ferramenta.

3. Diário Oficial (Gazeta SP)
   - `src/tools/diario-oficial.ts` faz scraping de:
     - `https://www.gazetasp.com.br/publicidade-legal/itapevi`
   - Ajuste seletores se estrutura HTML mudar.
   - Cache de 6 horas.

2. MeuMunicipio.org.br (censo 2010)
   - `src/tools/meumunicipio.ts` faz scraping de:
     - `https://meumunicipio.org.br/perfil-municipio/3522505-Itapevi-SP`
   - Para migrar para CSV, use `scripts/download-dados-municipio.ts` e adapte a ferramenta.

3. Diário Oficial (Gazeta SP)
   - `src/tools/diario-oficial.ts` faz scraping de:
     - `https://www.gazetasp.com.br/publicidade-legal/itapevi`
   - Ajuste seletores se estrutura HTML mudar.
   - Cache de 6 horas.

## 💡 Exemplos de Uso

### Via cliente MCP (Cursor, Claude etc.)
Depois de configurar o servidor, você pode fazer perguntas como:
- "Quais os bairros com maior demanda por postos de saúde?"
- "Quanto foi gasto em saúde no Jardim São Paulo em 2025?"
- "Mostre as licitações de 2024 acima de R$ 100 mil"
- "Qual a população de Itapevi segundo o último censo?"

### Via linha de comando

Não há CLI ou pacote npm publicado para este protótipo. Use os scripts locais `npm run build`, `npm start`, `npm run dev` e `npm test` conforme descritos neste README.

## 🏗️ Estrutura do Projeto

```
itapevi-em-dados/
├── src/
│   ├── server.ts           # Servidor MCP principal
│   ├── tools/
│   │   ├── transparencia.ts # Portal da Transparência
│   │   ├── demandas.ts      # Pensando em Itapevi
│   │   ├── legislacao.ts    # Leis municipais
│   │   ├── ibge.ts          # Dados do IBGE
│   │   └── index.ts         # Exportação das tools
│   ├── utils/
│   │   ├── scraping.ts      # Funções de scraping
│   │   └── cache.ts         # Cache para evitar requisições repetidas
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── scripts/
│   └── dev.ts               # Script de desenvolvimento
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## 🔧 Como Contribuir

Adoramos contribuições! Veja como você pode ajudar:

## 🗂️ CSV de dados municipais (MeuMunicipio)

O projeto possui script de download CSV em `scripts/download-dados-municipio.ts`.

1. Atualize `scripts/download-dados-municipio.ts` com a URL real do dataset CSV.
2. Rode:
```bash
npm run download:dados
```
3. O arquivo será salvo em `data/itapevi-dados.csv` e, com `DATA_SOURCE=csv`, `dados_ibge` usará essa base.

## 🔧 Variáveis de ambiente

- `DATA_SOURCE=ibge` (padrão) - usa API pública do IBGE
- `DATA_SOURCE=csv` - usa CSV local em `data/itapevi-dados.csv`

- `PORT=3000` - para endpoint HTTP de health


## 🔧 Como Contribuir

Adoramos contribuições! Veja como você pode ajudar:
- Reportar bugs – Abra uma issue descrevendo o problema
- Sugerir melhorias – Novas fontes de dados, ferramentas úteis
- Enviar código – Faça um fork, crie uma branch e abra um Pull Request
- Divulgar – Compartilhe o projeto com quem possa se interessar

Diretrizes
- Mantenha o código limpo e comentado
- Atualize a documentação quando necessário
- Teste suas alterações antes de enviar

## � Endpoint de Health e supervisão

Além do transporte MCP `stdio`, há um pequeno servidor HTTP para checagem de saúde:
- `src/app.ts` expõe `GET /health` com estado e ferramentas.
- Execute com:
  - `node dist/app.js` (após `npm run build`) ou `npx tsx src/app.ts` em dev.

### Verificação
```bash
curl http://localhost:3000/health
```

## �📄 Licença

O código deste repositório é disponibilizado sob a [Apache License 2.0](LICENSE). Dados, documentos e fontes públicas podem ter licenças, termos de uso e responsabilidades próprios; a licença do código não concede direitos sobre esses materiais.

## 🙏 Agradecimentos

- Câmara Municipal de Itapevi, pelos dados do "Pensando em Itapevi"
- Comunidade Open Source, pelas bibliotecas que tornaram isso possível
- Todos os cidadãos que lutam por mais transparência

## 📞 Contato

- Autor: Marcelo Augusto
- Organização/projeto: Rayzen Gov
- GitHub: https://github.com/marcelorayzen

Itapevi em Dados – Transformando informação em cidadania. 🏙️
