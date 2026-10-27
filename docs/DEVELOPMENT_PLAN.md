# Plano de desenvolvimento

## Como administrar o plano

- Cada tarefa possui um identificador estável (`P0-01`, `F1-03` etc.).
- Status permitido: `[ ]` não iniciada, `[-]` em andamento, `[x]` concluída e verificada, `[!]` bloqueada.
- Uma tarefa só muda para `[x]` quando atende ao critério de aceite e deixa evidência no PR, issue ou registro de execução.
- Itens de arquitetura V2 continuam **planejados** até que código, teste e evidência operacional existam.
- Deploy em produção requer revisão humana pelo ApprovalGate; nenhuma tarefa de entrega pode contornar esse gate.

## Acompanhamento

- **Decisor final:** Marcelo Augusto.
- **Acompanhamento do plano:** Marcelo Augusto e Rayzen.
- **Papel do Rayzen:** organizar evidências, manter plano/backlog atualizados e solicitar decisão quando houver escolha de escopo, prioridade, risco ou informação faltante.
- **Ritmo de revisão:** semanal.

## Marcos e critérios de saída

| Marco | Objetivo | Critério de saída |
|---|---|---|
| P0 — Base confiável | Preparar a V1 para evolução controlada | repositório seguro, CI e inventário de fontes/licenças aprovados |
| F1 — Uma fonte governada | Validar o fluxo vertical de dados | uma fonte reprocessável com artefato, evento e evidência consultável |
| F2 — Conhecimento verificável | Projetar relações apenas quando necessário | uma consulta relacional com todos os elos citáveis |
| F3 — Entrega controlada | Expor catálogo e consultas consistentes | contrato único para MCP/API futura, sem prometer API pública |
| F4 — Inteligência responsável | Produzir insights descritivos | regra, período, cobertura e fontes mostrados em cada insight |
| F5 — Multi-cidade | Reutilizar o núcleo | segunda configuração municipal isolada e testada |

## P0 — Base confiável

- [x] **P0-01 — Definir responsável e rito de priorização.** Marcelo e Rayzen acompanham o plano com revisão semanal.
  - Aceite: backlog tem prioridade, responsável e estado para os itens ativos.
- [x] **P0-02 — Separar artefatos gerados do código-fonte.** `node_modules/` e `dist/` foram retirados do índice Git, preservados localmente e incluídos no `.gitignore`; build e testes passaram após a migração (commit `2bb9fd1`).
  - Aceite: política documentada, `.gitignore` coerente e mudança revisada.
- [x] **P0-03 — Configurar CI mínimo.** Workflow validado no GitHub Actions na execução `#1` do commit `d2e5b21`, com build e testes concluídos com sucesso.
  - Aceite: workflow reproduz `npm run build` e `npm test` em PR.
- [-] **P0-04 — Inventariar dependências e licenças.** Inventário direto criado; transitivas e revisão humana pendentes.
  - Aceite: inventário versionado e exceções registradas.
- [-] **P0-05 — Inventariar fontes atuais.** Registro inicial criado; termos e responsáveis pendentes de validação humana.
  - Aceite: registro revisável por fonte e limites de redistribuição conhecidos.
- [-] **P0-06 — Revisar segurança operacional.** Checklist inicial criado; aprovação operacional pendente.
  - Aceite: checklist de release e de contribuição aprovado.

## F1 — Uma fonte governada

- [x] **F1-01 — Escolher a fonte piloto.** Diário Oficial e emendas parlamentares foram escolhidos para Document Intelligence; IBGE é a fonte estruturada complementar. A LOA 2026 oficial foi aprovada para teste local controlado com dados reais.
  - Aceite: decisão registrada em `docs/F1_PILOT_DECISION.md`; publicação e redistribuição permanecem condicionadas à validação de fonte e termos.
- [x] **F1-02 — Modelar catálogo e proveniência mínimos.** Modelo e exemplo controlado em `docs/F1_CATALOG_PROVENANCE_MODEL.md`, aprovados pelo decisor em 27/10/2026.
  - Aceite: modelo e exemplos revisados; ADRs aplicáveis atualizados se necessário.
- [x] **F1-03 — Persistir artefato bruto e checksum.** PostgreSQL local registrou a LOA 2026 por URL, data, tamanho, referência local e SHA-256; duas execuções retornaram o mesmo artefato sem duplicação. Evidência em `docs/F1_POSTGRES_VALIDATION.md` e modelo F1-02 aprovado.
  - Aceite: reprocessamento usa o mesmo artefato e detecta duplicidade.
- [x] **F1-04 — Normalizar a fonte piloto.** A LOA 2026 recebeu normalizador conservador para corpo da lei, com referência manual nas páginas 1 e 2; tabelas complexas permanecem excluídas. Evidência em `docs/F1_NORMALIZATION_LOA_2026.md`.
  - Aceite: esquema normalizado versionado e teste com exemplos reais permitidos.
- [x] **F1-05 — Registrar eventos e evidências.** A LOA 2026 gerou evento interno `candidate` ligado a execução, fonte, artefato e três evidências de página. Evidência em `docs/F1_EVENT_EVIDENCE_VALIDATION.md`.
  - Aceite: consulta interna recupera evento, origem, coletado em e transformação.
- [x] **F1-06 — Reprocessar e observar.** A reexecução da LOA reutilizou a mesma execução/evento sem duplicar registros; uma falha controlada foi recuperada por `run_id`. Evidência em `docs/F1_REPROCESSING_VALIDATION.md`.
  - Aceite: duas execuções não duplicam fatos e falha pode ser investigada por `run_id`.
- [x] **F1-07 — Validar exportação municipal LAI.** A exportação JSON de convidado do painel Previsto e Empenhado foi registrada como artefato local, normalizada com filtros e reprocessada sem duplicação. Evidência em `docs/F1_LAI_EXPORT_VALIDATION.md`.
  - Aceite: o artefato, os filtros, os totais e a execução podem ser recuperados localmente por checksum.

## F2 — Conhecimento verificável

- [x] **F2-01 — Definir resolução de entidades.** O recorte inicial de órgãos e secretarias municipais possui modelo persistido, um alias resolvido por normalização de caixa e um caso ambíguo mantido em revisão. Evidência em `docs/F2_ENTITY_RESOLUTION_VALIDATION.md`.
  - Aceite: um caso aceito e um caso ambíguo podem ser recuperados até o artefato, página e decisão de resolução.
- [x] **F2-02 — Provar uma projeção relacional.** A consulta de alias, entidade, artefato e fonte foi atendida por `JOIN`s no PostgreSQL; o grafo foi adiado por não haver justificativa técnica nesta etapa. Evidência em `docs/F2_RELATIONAL_PROJECTION_EVALUATION.md`.
  - Aceite: comparação documentada entre consulta relacional convencional e projeção proposta.
- [ ] **F2-03 — Implementar projeção idempotente se justificada.** Nunca usar o grafo como fonte de verdade.
  - Aceite: projeção pode ser reconstruída a partir dos fatos aceitos.
- [x] **F2-04 — Entregar uma consulta citável.** A consulta local de aliases de órgãos/secretarias recupera identidade aceita quando houver, artefato, checksum, fonte, página/seção e limitações de cobertura. Evidência em `docs/F2_CITABLE_QUERY_VALIDATION.md`.
  - Aceite: cada elo aponta para evidência e limitações de cobertura.

## F3 — Entrega controlada

- [x] **F3-01 — Definir contrato de resposta comum.** O envelope JSON `1.0` padroniza dados, evidências, cobertura, confiança, limitações e metadados; há construtor e testes de compatibilidade. A integração de conectores existentes será gradual. Especificação em `docs/F3_RESPONSE_CONTRACT.md`.
  - Aceite: contrato versionado e testes de compatibilidade.
- [x] **F3-02 — Criar catálogo navegável de datasets.** O catálogo local usa o contrato `1.0` e exibe escopo, atualização, fonte, termos, status, artefatos e limitações do piloto F1. Evidência em `docs/F3_DATASET_CATALOG_VALIDATION.md`.
  - Aceite: piloto lista a fonte F1 e suas limitações.
- [ ] **F3-03 — Avaliar API pública, sem antecipá-la.** Definir autenticação, rate limiting, OpenAPI e riscos somente após F1/F2.
  - Aceite: decisão explícita de seguir, adiar ou rejeitar.
- [x] **F3-04 — Construir interface web de consulta e demonstração.** A demonstração local e somente leitura apresenta catálogo, entidades, evidências, cobertura e limites pelo contrato `1.0`, sem chamadas externas ou publicação. Evidência em `docs/F3_WEB_DEMO_VALIDATION.md`.
  - Aceite: fluxo demonstrável localmente com consulta, fonte/artefato/página visíveis, limites de cobertura e roteiro de demonstração; publicação externa somente após revisão humana de segurança, termos e conteúdo.

## F4 — Inteligência responsável

- [ ] **F4-01 — Definir regras de insight.** Registrar fórmula, população, período, limiar e dados excluídos.
  - Aceite: uma regra reproduzível em dados controlados.
- [ ] **F4-02 — Aplicar ADR-011.** Validar linguagem neutra, fontes, recortes e revisão humana para indicadores sensíveis.
  - Aceite: checklist não acusatório aprovado em exemplos de saída.
- [ ] **F4-03 — Avaliar alertas.** Definir assinatura, frequência, ruído, destinatário e revogação.
  - Aceite: piloto sem envio automático em produção.

## F5 — Multi-cidade

- [ ] **F5-01 — Parametrizar configuração municipal.** Separar código IBGE, URLs, schemas e periodicidade da lógica de domínio.
  - Aceite: configuração de município não exige fork do núcleo.
- [ ] **F5-02 — Testar isolamento.** Cobrir tenant, município, dataset, job e leitura.
  - Aceite: teste prova ausência de vazamento entre duas configurações.
- [ ] **F5-03 — Realizar piloto de segunda cidade.** Fazer somente com fonte licenciada e responsável institucional definido.
  - Aceite: onboarding documentado e aprovações registradas.
