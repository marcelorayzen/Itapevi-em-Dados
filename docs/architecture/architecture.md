# Arquitetura-alvo V2

> Esta é a direção arquitetural de evolução. O estado publicado está em [CURRENT_PUBLIC_PRODUCT_STATUS.md](../CURRENT_PUBLIC_PRODUCT_STATUS.md). Componentes como Neo4j, Timeline e Spatial Engine permanecem planejados até haver código, testes e evidência operacional.

## Baseline V1 de origem

```text
Fonte -> coleta/scraping -> MCP Tool -> resposta
```

Esta arquitetura era a do protótipo de origem. Ela não continha grafo, memória histórica, banco transacional, lineage, portal ou API pública. O estado atual já possui PostgreSQL, proveniência para recortes publicados, portal e API restrita; os demais componentes continuam sujeitos ao roadmap.

## Diretriz V2

Os componentes a seguir são módulos lógicos e não uma exigência de microserviços separados. PDFs e documentos complexos podem seguir por uma camada Docling após validação; APIs, CSV e HTML estruturado devem seguir normalização direta. PostgreSQL é a fonte inicial de verdade proposta. O grafo só deve ser adotado para relações que justifiquem navegação relacional.

```text
Fontes públicas
  -> Collection Engine -> Raw Store / Dataset Registry
  -> Normalização documental -> Extraction Engine
  -> Event Store (PostgreSQL) -----> Knowledge Projection (Neo4j)
             |                         |
             +--> Provenance / Lineage -+--> Timeline / Spatial projections
                                           -> Insight e Alert workflows
                                                     -> Portal | API | MCP
```

| Componente | Responsabilidade | Limite |
|---|---|---|
| Collection | buscar, versionar e registrar fonte | não afirmar fatos |
| Normalização | estruturar documentos preservando página/seção | não decidir identidade |
| Extraction | propor fatos, entidades e relações | não publicar sem origem |
| Memory | eventos/fatos versionados no PostgreSQL | não substituir grafo |
| Knowledge | grafo de relações aceitas | não ser única cópia |
| Provenance/Lineage | origem e transformação | não dar selo automático de verdade |
| Timeline/Spatial | consultas temporais e territoriais | não modificar dados de origem |
| Insight/Alert | regras e análises reproduzíveis | não acusar irregularidade |
| Delivery | portal, API e MCP com citações | não acoplar domínio a cliente |

## Fluxo de ingestão

1. Registrar dataset, fonte e execução de coleta.
2. Armazenar artefato bruto com checksum e referência estável.
3. Normalizar conteúdo mantendo ponteiro à página/seção.
4. Extrair candidatos com versão de modelo/regra e confiança.
5. Resolver identidade e revisar conflitos.
6. Persistir eventos/fatos aceitos no PostgreSQL.
7. Projetar dados aceitos para Neo4j, busca, timeline e mapa.
8. Gerar insights/alertas apenas com cobertura e regra declaradas.

Toda leitura e escrita de domínio é isolada por `tenant_id`, `municipio_id`, `dataset_id` e `source_record_id`. Projeções carregam `source_event_id`, `provenance_id` e `schema_version`.
