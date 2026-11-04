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
| F3 — Entrega controlada | Expor catálogo e consultas consistentes | contrato único, API pública restrita e portal com evidências |
| F4 — Inteligência responsável | Produzir insights descritivos | regra, período, cobertura e fontes mostrados em cada insight |
| F5 — Multi-cidade | Reutilizar o núcleo | segunda configuração municipal isolada e testada |
| R0 — Demonstração pública útil | Responder perguntas reais com dados reais e evidências | três temas aprovados, respostas reproduzíveis, interface pública compreensível e piloto monitorado |

## R0 — Produto público verificável

### Resultado esperado

Uma pessoa deve conseguir perguntar, por exemplo, “quanto foi previsto e realizado por órgão?” ou “como se distribuem as compras por modalidade?”, receber um resultado objetivo e abrir a evidência que mostra fonte, período, filtros, cálculo, cobertura e limites. O sistema não deve completar lacunas com linguagem persuasiva nem declarar irregularidade.

### Ordem de entrega

1. **Governar a fonte.** Confirmar por dataset a condição de uso público; manter em ambiente local os dados municipais ainda pendentes.
2. **Transformar dados reais em consulta.** Ingerir, normalizar e reconciliar população, execução e compras como fatos PostgreSQL com proveniência.
3. **Responder sem IA generativa.** Criar intenções determinísticas e respostas citáveis para as perguntas priorizadas. Isso já entrega utilidade e permite testar verdade, cobertura e UX.
4. **Avaliar.** Executar uma bateria de perguntas reais e registrar respostas esperadas, evidências e recusas corretas.
5. **Acrescentar IA com guarda-corpos.** O modelo apenas classifica a pergunta, seleciona uma consulta permitida e redige a resposta a partir do resultado estruturado. Ele não acessa PDFs brutos, banco livremente, segredos ou fontes sem allowlist.
6. **Pilotar publicamente.** Aplicar proteção contra abuso, observabilidade proporcional, botão de feedback e revisão semanal Marcelo/Rayzen.

### Marco complementar: Diário Oficial

A edição 1612 do Diário Oficial de Itapevi foi persistida localmente com artefato, checksum, evento e duas evidências de página; o reprocessamento reutilizou os mesmos registros. A extração estrutural integral de PDFs longos com Docling ainda não foi validada e permanece como trabalho explícito, sem ser apresentada como capacidade entregue.

### Critérios de aceite do R0

- Três domínios de pergunta publicados: população, execução orçamentária e compras/licitações agregadas.
- Cada resposta aprovada contém ao menos uma evidência navegável e informa período, cobertura e limitações.
- Perguntas fora do catálogo recebem recusa útil, sem criar números, vínculos, suspeitas ou acusações.
- Todo dado municipal público passou por decisão documentada de uso; dados ainda pendentes continuam fora da API e do site.
- Testes automatizados cobrem cálculo, fonte indisponível, dados ausentes, filtro de período, origem da evidência e entradas adversariais.
- O piloto público contém proteção de requisições, registro técnico mínimo e caminho de correção/feedback.

## P0 — Base confiável

- [x] **P0-01 — Definir responsável e rito de priorização.** Marcelo e Rayzen acompanham o plano com revisão semanal.
  - Aceite: backlog tem prioridade, responsável e estado para os itens ativos.
- [x] **P0-02 — Separar artefatos gerados do código-fonte.** `node_modules/` e `dist/` foram retirados do índice Git, preservados localmente e incluídos no `.gitignore`; build e testes passaram após a migração (commit `2bb9fd1`).
  - Aceite: política documentada, `.gitignore` coerente e mudança revisada.
- [x] **P0-03 — Configurar CI mínimo.** Workflow validado no GitHub Actions na execução `#1` do commit `d2e5b21`, com build e testes concluídos com sucesso.
  - Aceite: workflow reproduz `npm run build` e `npm test` em PR.
- [-] **P0-04 — Inventariar dependências e licenças.** Inventário direto criado; transitivas e revisão humana pendentes.
  - Aceite: inventário versionado e exceções registradas.
- [-] **P0-05 — Inventariar fontes atuais.** Registro e primeira revisão documental criados; termos, atribuições e responsáveis por dataset permanecem pendentes de validação humana. Evidência em `docs/P0_DATA_LICENSE_REVIEW.md`.
  - Aceite: registro revisável por fonte e limites de redistribuição conhecidos.
- [-] **P0-06 — Revisar segurança operacional.** Checklist inicial criado; aprovação operacional pendente.
  - Aceite: checklist de release e de contribuição aprovado.
- [x] **P0-07 — Conciliar a documentação operacional.** Índice, estado público, capacidades, backlog, manual e referências históricas foram reconciliados em 03/11/2026.
  - Aceite: documentos canônicos indicam o produto publicado e registros antigos apontam para a referência vigente.
- [ ] **P0-08 — Incluir a checagem de links da documentação no CI.** O comando local `npm run docs:check` já verifica links Markdown locais; falta executá-lo em todo pull request e push.
  - Aceite: uma alteração com link local inválido falha no CI antes do merge.

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
- [x] **F1-08 — Validar exportação municipal de compras por modalidade.** A exportação CSV de convidado foi registrada como artefato local, normalizada em totais e modalidades e mantida fora do Git. Evidência em `docs/F1_LAI_PROCUREMENT_EXPORT_VALIDATION.md`.
  - Aceite: o artefato, checksum, configuração de processamento e evento agregado podem ser recuperados localmente sem expor processos ou objetos no dado derivado.

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
- [x] **F3-03 — Avaliar e publicar API pública restrita.** A decisão inicial evoluiu para Worker Cloudflare publicado com Hyperdrive, Turnstile, rate limit e visões públicas agregadas; evidências e controles atuais estão em `docs/F3_PUBLIC_API_WORKER.md` e `docs/R0_PRODUCTION_PUBLIC_API_VALIDATION.md`.
  - Aceite: API responde somente a recortes aprovados, com controles e evidências verificáveis.
- [x] **F3-04 — Construir console técnico web local.** A demonstração local e somente leitura apresenta catálogo, entidades, evidências, cobertura e limites pelo contrato `1.0`, sem chamadas externas ou publicação. Evidência em `docs/F3_WEB_DEMO_VALIDATION.md`.
  - Aceite: fluxo demonstrável localmente para validação técnica, com consulta, fonte/artefato/página visíveis e limites de cobertura.
- [-] **F3-05 — Construir portal de apresentação e testes institucionais.** O portal de usuário está publicado com narrativa pública, consulta livre dentro da cobertura, fontes, limites, trilha de auditoria e canal de feedback. O roteiro de avaliação com cidadãos, vereadores/assessores, prefeitura e BBSIA permanece em execução em `docs/NATURAL_LANGUAGE_PILOT_N4_PROTOCOL.md`.
  - Aceite: fluxos testados por cidadão, vereador/assessor, prefeitura e BBSIA; dados reais aprovados, hospedagem explicitamente aprovada e nenhum conteúdo pendente ou segredo publicado.

## F4 — Inteligência responsável

- [x] **F4-01 — Definir regras de insight.** A regra de execução orçamentária previsto × realizado foi implementada de modo reproduzível, com fórmula, período, cobertura e exclusões documentados em `docs/F4_BUDGET_EXECUTION_INSIGHT.md`.
  - Aceite: uma regra reproduzível em dados controlados, validada pela consulta guiada local.
- [x] **F4-02 — Aplicar ADR-011.** Consultas acusatórias são bloqueadas antes de consultar dados e retornam limite explicável; teste e checklist estão em `docs/F4_NON_ACCUSATORY_VALIDATION.md`.
  - Aceite: checklist não acusatório aprovado em exemplos de saída.
- [x] **F4-03 — Avaliar alertas.** Relatório semanal local para Marcelo e Rayzen cobre novas coletas, falhas, termos e aliases pendentes; sem envio externo ou agendamento. Evidência em `docs/F4_WEEKLY_ALERT_REPORT.md`.
  - Aceite: piloto sem envio automático em produção.

## F5 — Multi-cidade

- [ ] **F5-01 — Parametrizar configuração municipal.** Separar código IBGE, URLs, schemas e periodicidade da lógica de domínio.
  - Aceite: configuração de município não exige fork do núcleo.
- [ ] **F5-02 — Testar isolamento.** Cobrir tenant, município, dataset, job e leitura.
  - Aceite: teste prova ausência de vazamento entre duas configurações.
- [ ] **F5-03 — Realizar piloto de segunda cidade.** Fazer somente com fonte licenciada e responsável institucional definido.
  - Aceite: onboarding documentado e aprovações registradas.
