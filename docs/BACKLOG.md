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
| R0-03 | P1 | Consolidar ingestão real de compras por modalidade em PostgreSQL, com artefato, checksum e reprocessamento | R0-02 | [ ] |
| R0-04 | P1 | Modelar licitação, modalidade, período, órgão e fornecedor como fatos/evidências — sem presumir identidade de empresa | R0-03 | [ ] |
| R0-05 | P1 | Validar qualidade: totalizações, período, filtros de origem, duplicidade e reconciliação com o painel oficial | R0-03 | [ ] |
| R0-06 | P1 | Publicar somente agregados aprovados em uma API de consulta citável | R0-02, R0-05 | [ ] |
| R0-07 | P1 | Implementar respostas determinísticas para população, previsto × realizado e compras por modalidade | R0-06 | [ ] |
| R0-08 | P1 | Construir página de evidência por resposta: fonte, arquivo, período, filtros, cálculo, cobertura e limites | R0-07 | [ ] |
| R0-09 | P1 | Criar conjunto de avaliação com perguntas reais de cidadão, vereador, prefeitura e BBSIA | R0-07 | [ ] |
| R0-10 | P1 | Aplicar limite de requisições, telemetria mínima sem dados pessoais e resposta segura a abuso | R0-06 | [ ] |
| R0-11 | P2 | Integrar modelo de linguagem apenas como intérprete de pergunta e redator de resposta baseada nas evidências retornadas | R0-07, R0-09, R0-10 | [-] |
| R0-12 | P2 | Reprojetar a interface como produto de consulta: busca, resultados, filtros, evidências, cobertura e feedback | R0-08, R0-11 | [ ] |
| R0-13 | P2 | Piloto público monitorado com roteiro de avaliação e revisão semanal Marcelo/Rayzen | R0-09, R0-10, R0-12 | [ ] |

## Registro de bloqueios

| Data | Item | Bloqueio | Próxima ação | Responsável |
|---|---|---|---|---|
| — | — | — | — | — |

| 2026-10-29 | F3-05 | Definicao pendente: dados demonstrativos, destino de hospedagem, publico de teste e responsavel operacional | Marcelo decide o formato inicial; equipe prepara UX, conteudo, testes e documentacao | Marcelo / Rayzen |
| 2026-10-31 | R0-02 | Ainda não há confirmação específica de redistribuição para as exportações municipais LAI/LOA; o portal oficial retornou HTTP 503 na nova verificação de termos | Enviar solicitação institucional pronta em `docs/MUNICIPAL_DATA_REUSE_REQUEST.md` e registrar a resposta por dataset | Prefeitura de Itapevi / Marcelo |

## Registro de decisões operacionais

| Data | Decisão | Evidência/ADR | Impacto |
|---|---|---|---|
| — | — | — | — |
| 2026-10-31 | A primeira fonte pública real fica limitada ao agregado IBGE 29171; perguntas livres não podem ampliar o catálogo nem inferir fatos sem evidência | `docs/P0_DATA_LICENSE_REVIEW.md`, ADR-009 e ADR-011 | Protege a demonstração enquanto a ingestão municipal e as permissões são concluídas |
