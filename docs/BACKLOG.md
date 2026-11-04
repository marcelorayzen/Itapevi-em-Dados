# Backlog de desenvolvimento

## Regras de priorização

- **P0:** bloqueia segurança, governança ou confiabilidade mínima.
- **P1:** produz o primeiro fluxo V2 verificável.
- **P2:** amplia capacidades após a base comprovada.
- **P3:** descoberta ou melhoria sem compromisso de execução.

| ID | Prioridade | Item | Dependência | Estado |
|---|---|---|---|---|
| P0-01 | P0 | Rito de priorização e responsáveis | — | [x] |
| P0-02 | P0 | Política para `dist/` e `node_modules` rastreados | P0-01 | [x] |
| P0-03 | P0 | CI de build e testes | P0-01 | [x] |
| P0-04 | P0 | Inventário de licenças de dependências | P0-01 | [-] |
| P0-05 | P0 | Registro de fontes e termos de uso | P0-01 | [-] |
| P0-06 | P0 | Checklist de segurança e release | P0-01 | [-] |
| F1-01 | P1 | Escolha da fonte piloto | P0-05 | [x] |
| F1-02 | P1 | Modelo mínimo de catálogo e proveniência | F1-01 | [x] |
| F1-03 | P1 | Artefato bruto e checksum | F1-02 | [x] |
| F1-04 | P1 | Normalização da fonte piloto | F1-03 | [x] |
| F1-05 | P1 | Eventos e evidências | F1-04 | [x] |
| F1-06 | P1 | Reprocessamento e observabilidade | F1-05 | [x] |
| F1-07 | P1 | Exportação municipal LAI controlada | F1-03 | [x] |
| F1-08 | P1 | Exportação municipal de compras por modalidade | F1-03 | [x] |
| F2-01 | P2 | Resolução de entidades | F1-05 | [x] |
| F2-02 | P2 | Prova de necessidade do grafo | F2-01 | [x] |
| F2-03 | P2 | Projeção relacional, se aprovada | F2-02 | [ ] |
| F2-04 | P2 | Consulta citável com evidências | F2-01 | [x] |
| F3-01 | P2 | Contrato de resposta comum | F1-05 | [x] |
| F3-02 | P2 | Catálogo navegável de datasets | F1-05 | [x] |
| F3-04 | P2 | Interface web de consulta e demonstração para prefeituras e BBSIA | F3-01, F3-02 | [x] |
| F3-03 | P2 | Avaliação e preparação de prévia privada | F3-01, F3-02 | [x] |
| F3-05 | P2 | Portal de apresentação e testes institucionais | F3-04, P0-05 | [-] |
| F4-01 | P2 | Regra de insight reproduzível | F1-06 | [x] |
| F4-02 | P2 | Aplicar ADR-011 em consultas públicas | F4-01 | [x] |
| F4-03 | P2 | Relatório semanal de alertas governados | F4-02 | [x] |
| F5-01 | P3 | Configuração multi-cidade | F1-02 | [ ] |

## R0 — Produto público com dados reais e respostas verificáveis

_Esta trilha não substitui as fases F1–F5. Ela organiza a passagem do protótipo técnico para uma demonstração pública útil. Uma tarefa de dados municipais não pode ser concluída apenas porque a informação está visível em um portal: exige fonte, termos, proveniência e critério de aceite._

| ID | Prioridade | Item | Dependência | Estado |
|---|---|---|---|---|
| R0-01 | P0 | Definir recorte da primeira demonstração real: população, execução orçamentária e compras/licitações agregadas | P0-05 | [-] |
| R0-02 | P0 | Confirmar por fonte as regras de atribuição e redistribuição pública dos dados municipais | R0-01 | [!] |
| R0-03 | P1 | Consolidar ingestão real de compras por modalidade em PostgreSQL, com artefato, checksum e reprocessamento | R0-02 | [x] |
| R0-04 | P1 | Modelar licitação, modalidade, período, órgão e fornecedor como fatos/evidências — sem presumir identidade de empresa | R0-03 | [x] |
| R0-05 | P1 | Validar qualidade: totalizações, período, filtros de origem, duplicidade e reconciliação com o painel oficial | R0-03 | [x] |
| R0-06 | P1 | Publicar somente agregados aprovados em uma API de consulta citável | R0-02, R0-05 | [ ] |
| R0-07 | P1 | Implementar respostas determinísticas para população, previsto × realizado e compras por modalidade | R0-06 | [ ] |
| R0-08 | P1 | Construir página de evidência por resposta: fonte, arquivo, período, filtros, cálculo, cobertura e limites | R0-07 | [ ] |
| R0-09 | P1 | Criar conjunto de avaliação com perguntas reais de cidadão, vereador, prefeitura e BBSIA | R0-07 | [-] |
| R0-10 | P1 | Aplicar limite de requisições, telemetria mínima sem dados pessoais e resposta segura a abuso | R0-06 | [x] |
| R0-11 | P2 | Integrar modelo de linguagem apenas como intérprete de pergunta e redator de resposta baseada nas evidências retornadas | R0-07, R0-09, R0-10 | [-] |
| R0-12 | P2 | Reprojetar a interface como produto de consulta: busca, resultados, filtros, evidências, cobertura e feedback | R0-08, R0-11 | [ ] |
| R0-13 | P2 | Piloto público monitorado com roteiro de avaliação e revisão semanal Marcelo/Rayzen | R0-09, R0-10, R0-12 | [ ] |
| R0-14 | P1 | Ingerir metadados e estrutura do Diário Oficial oficial, começando pela edição 1612 | R0-01 | [-] |
| R0-15 | P1 | Tornar a extração estrutural Docling do Diário Oficial observável, reprodutível e testada | R0-14 | [-] |

## Registro de bloqueios

## Expansão de consultas reais

| ID | Prioridade | Item | Dependência | Estado |
|---|---|---|---|---|
| R1-01 | P1 | Ingerir execução detalhada de saúde por mês, órgão, programa, ação e unidade | fonte oficial detalhada | [x] |
| R1-02 | P1 | Modelar unidades de saúde e sinônimos governados, incluindo pronto-socorro, PS e urgência | R1-01 | [x] |
| R1-03 | P1 | Publicar consulta citável de gasto por unidade de saúde e período | R1-01, R1-02 | [x] |
| R1-04 | P1 | Recusar com explicação perguntas cujo período ou unidade não esteja coberto | R1-03 | [x] |

## Expansão de educação e Escolas do Futuro

| ID | Prioridade | Item | Dependência | Estado |
|---|---|---|---|---|
| R2-01 | P1 | Registrar o catálogo oficial de unidades escolares municipais, com nome, endereço, contato, fonte e data de coleta | página oficial de escolas | [-] |
| R2-02 | P1 | Ingerir e estruturar atos oficiais sobre Escolas do Futuro, preservando edição, página e trecho de evidência | R0-14, R0-15 | [-] |
| R2-03 | P2 | Relacionar obras, contratos e unidades escolares somente quando o vínculo constar na fonte oficial | R2-01, contratos com objeto verificável | [ ] |
| R2-04 | P2 | Publicar consultas sobre cobertura e status documentado de unidades, com data de referência e limites visíveis | R2-01, R2-02 | [ ] |

## Perguntas naturais governadas

| ID | Prioridade | Item | Dependência | Estado |
|---|---|---|---|---|
| N1-01 | P1 | Contrato JSON e validação local de intenção, período e filtros | R0-07 | [x] |
| N1-02 | P1 | Roteador semântico Workers AI com fallback determinístico | N1-01 | [x] |
| N1-03 | P1 | Consultas de orçamento por órgão e listagem de órgãos cobertos | N1-01 | [x] |
| N1-04 | P1 | Avaliação com 40 perguntas reais anonimizadas | N1-02, N1-03 | [ ] |
| N1-05 | P2 | Ativação pública controlada do piloto de IA | N1-04, aprovação explícita | [ ] |
| N1-06 | P2 | Revisão semanal de métricas e decisão de capacidade | N1-05 | [ ] |

| Data | Item | Bloqueio | Próxima ação | Responsável |
|---|---|---|---|---|
| — | — | — | — | — |

| 2026-10-29 | F3-05 | Definicao pendente: dados demonstrativos, destino de hospedagem, publico de teste e responsavel operacional | Marcelo decide o formato inicial; equipe prepara UX, conteudo, testes e documentacao | Marcelo / Rayzen |
| 2026-10-31 | R0-02 | Ainda não há confirmação específica de redistribuição para as exportações municipais LAI/LOA; o portal oficial retornou HTTP 503 na nova verificação de termos | Enviar solicitação institucional pronta em `docs/MUNICIPAL_DATA_REUSE_REQUEST.md` e registrar a resposta por dataset | Prefeitura de Itapevi / Marcelo |
| 2026-11-02 | R2-01/R2-02 | Nenhum bloqueio técnico; a descoberta identificou catálogo municipal de escolas e atos/notícias oficiais para Escolas do Futuro. Ainda não há artefato de coleta registrado. | Coletar os artefatos oficiais, revisar estrutura e criar dataset antes de publicar consultas. | Rayzen / Marcelo |

## Registro de decisões operacionais

| Data | Decisão | Evidência/ADR | Impacto |
|---|---|---|---|
| — | — | — | — |
| 2026-10-31 | A primeira fonte pública real fica limitada ao agregado IBGE 29171; perguntas livres não podem ampliar o catálogo nem inferir fatos sem evidência | `docs/P0_DATA_LICENSE_REVIEW.md`, ADR-009 e ADR-011 | Protege a demonstração enquanto a ingestão municipal e as permissões são concluídas |
| 2026-11-02 | O export oficial de empenhos detalhados é reprocessado com artefato, checksum, execução, evento e evidência próprios; duplicidades idênticas anteriores foram removidas em transação após validação por todos os campos de negócio. | `scripts/ingest-lai-detailed-commitments.ts`, checksum `5EB1B2B8...F03753` | Consultas públicas de unidades de saúde passam a referenciar o artefato correto. |
