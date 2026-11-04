# Handoff de metas para Rayzen — 03/11/2026

## Finalidade

Este documento encerra o ciclo de estabilização da execução orçamentária temporal e do piloto público de perguntas naturais. Ele permite que Rayzen crie as próximas metas a partir de fatos verificados, sem inferir escopo, afirmar cobertura inexistente ou reabrir decisões já tomadas.

Rayzen identifica o projeto pelo repositório Git `Itapevi-em-Dados`; nenhum token, credencial ou identificador interno deve ser gravado neste repositório.

## Fotografia verificável do encerramento

| Aspecto | Estado confirmado |
|---|---|
| Código e documentação | `main` publicado no commit `36c1ff8` (`feat: activate governed AI pilot and temporal budget coverage`). |
| Portal | `https://itapevi-em-dados.rayzen.com.br`, público e sem login. |
| API | `https://api-dados.rayzen.com.br`; Worker `ab3b331f-0e30-4395-b114-692f07385cc2`. |
| IA | Piloto público ativo, apenas como classificador de intenções permitidas. Turnstile, rate limit, Zod e consultas parametrizadas continuam obrigatórios. |
| Orçamento | Recortes separados de setembro e outubro de 2026, ambos por `Data de Empenho`, com período, filtro, checksum e evidência. Não há soma automática entre meses. |
| Segurança | `GET /health` confirmou Hyperdrive e piloto de IA ativos; pedido sem token Turnstile devolveu `403 verification_required`. |
| Qualidade | 34 testes do núcleo, 24 testes do Worker, tipagem e 104 documentos com links locais válidos. |

Referências: [estado público](CURRENT_PUBLIC_PRODUCT_STATUS.md), [validação temporal de orçamento](R0_BUDGET_TEMPORAL_COVERAGE_VALIDATION_2026-11-03.md), [decisão de IA](LLM_PILOT_DECISION.md) e [backlog](BACKLOG.md).

## Metas para criar no Rayzen

### G1 — Avaliar e estabilizar o piloto público

**Prioridade:** P0  
**Itens vinculados:** `N1-04`, `N1-06`, `R0-09`, `R0-13`  
**Responsáveis de acompanhamento:** Marcelo e Rayzen, em revisão semanal.

**Objetivo:** converter testes reais de cidadãos, vereadores, prefeitura e BBSIA em evidência de qualidade do portal, sem armazenar perguntas ou IPs em telemetria.

**Checklist de aceite:**

- [ ] Registrar ao menos 40 perguntas reais anonimizadas, com intenção esperada, período e resultado observado.
- [ ] Classificar cada caso como correto, esclarecimento adequado, indisponibilidade adequada ou falha.
- [ ] Verificar meta inicial: pelo menos 90% de respostas corretas/adequadas e 0 respostas factuais sem evidência.
- [ ] Abrir itens de backlog para falhas repetíveis, sem corrigi-las apenas com instruções ocultas ao modelo.
- [ ] Produzir relatório semanal agregado de volume, resultado, falha técnica e feedback; não registrar texto da pergunta nem IP.
- [ ] Registrar decisão de continuidade, ajuste de capacidade ou retorno à rota determinística ao fim da primeira semana útil.

**Não fazer nesta meta:** liberar SQL livre, respostas sem evidência, dados pessoais, novos temas ou fornecedor/modelo pago.

### G2 — Ampliar execução orçamentária com segurança temporal

**Prioridade:** P1  
**Itens vinculados:** `R0-17`, `R0-18`.

**Objetivo:** obter pelo menos 24 meses de recortes oficiais e permitir análises temporais somente após definir uma regra comprovável para medidas cumulativas.

**Checklist de aceite:**

- [ ] Coletar os arquivos oficiais mensais disponíveis, preservando artefato, checksum, origem, data de coleta e filtros.
- [ ] Registrar o período e o campo temporal por artefato; se o CSV não trouxer filtros, exigir confirmação operacional explícita e marcar a procedência como tal.
- [ ] Normalizar e reprocessar sem duplicar fatos entre artefatos.
- [ ] Comparar por amostra os totais, órgãos e períodos com o painel oficial.
- [ ] Definir, testar e documentar a política para séries cumulativas antes de responder totais anuais ou comparações entre meses.
- [ ] Atualizar visão pública, testes, trilha de auditoria, capacidades e manual somente depois da validação.

**Dependência externa:** os arquivos ou exportações oficiais correspondentes. Ausência de arquivo não autoriza estimar ou preencher lacunas.

### G3 — Fechar lacunas de governança e release

**Prioridade:** P0  
**Itens vinculados:** `R0-02`, `P0-04`, `P0-05`, `P0-06`.

**Objetivo:** converter a autorização operacional atual em registros institucionais revisáveis por fonte e deixar a rotina de release demonstravelmente segura.

**Checklist de aceite:**

- [ ] Obter e registrar, por dataset municipal publicado, atribuição, termos, condição de redistribuição, contato e data de revisão.
- [ ] Manter a separação entre código Apache-2.0, termos da fonte e derivados, conforme ADR-010.
- [ ] Concluir inventário de licenças diretas e transitivas, com exceções documentadas.
- [ ] Executar e aprovar checklist de release: segredo ausente do Git, migração revisada, testes, rollback, origem, evidência e monitoramento.
- [ ] Atualizar `DATA_SOURCES_REGISTER.md`, `P0_DATA_LICENSE_REVIEW.md`, checklist operacional e backlog com a evidência externa recebida.

**Ponto de decisão de Marcelo:** aceitar ou restringir cada condição de redistribuição que venha da Prefeitura ou de outro órgão.

### G4 — Preparar educação e Diário Oficial como fontes governadas

**Prioridade:** P1  
**Itens vinculados:** `R0-14`, `R0-15`, `R2-01`, `R2-02`.

**Objetivo:** provar o pipeline de Document Intelligence antes de abrir perguntas públicas sobre escolas, Educação ou Escolas do Futuro.

**Ordem obrigatória:**

1. persistir metadados e estrutura do Diário Oficial, começando pela edição 1612;
2. validar Docling de modo observável e reproduzível em documentos reais, inclusive páginas/tabelas escolhidas;
3. registrar o catálogo oficial de unidades escolares com data e fonte;
4. estruturar atos oficiais sobre Escolas do Futuro com edição, página, trecho e limite;
5. só então avaliar relações com contratos, obras ou unidades quando o vínculo estiver explícito na fonte.

**Critério de aceite:** cada novo fato leva a fonte, página/URL, artefato, checksum, transformação, cobertura e limitação. Nenhum PDF bruto é exposto pela API pública.

### G5 — Pesquisar a próxima expansão de produto antes de implementá-la

**Prioridade:** estudo planejado  
**Itens vinculados:** `F3-05`, `R0-12`, `R2-03`, `R2-04`.

**Objetivo:** transformar o feedback do piloto em uma decisão de produto para a próxima fonte ou experiência, sem presumir que mais IA, grafo, dashboard ou multi-cidade seja a resposta.

**Roteiro de estudo:**

- [ ] Consolidar dores e sugestões de usuários em categorias: linguagem, cobertura, evidência, período, navegação e acessibilidade.
- [ ] Priorizar perguntas recorrentes por impacto público, verificabilidade e disponibilidade de fonte oficial.
- [ ] Comparar três hipóteses de próxima entrega: expansão histórica de orçamento, educação/Escolas do Futuro e contratos/licitações detalhados.
- [ ] Para cada hipótese, estimar fonte, qualidade, termos, custo operacional, risco de interpretação e valor demonstrável para cidadão e município.
- [ ] Apresentar a Marcelo uma proposta curta com alternativas, evidências e decisão solicitada antes de iniciar implementação.

**Não iniciar automaticamente:** Neo4j/GraphRAG, multi-cidade, alertas externos, dashboards novos, novos provedores de IA ou integração paga. Cada um exige justificativa e decisão de escopo.

## Ordem recomendada

1. Iniciar G1 imediatamente, pois o portal está público e o feedback real já pode ser coletado.
2. Executar G3 em paralelo apenas para documentação, termos e controles; não publicar novos dados por causa dela.
3. Iniciar o estudo de G5 quando houver uma primeira rodada de feedback de G1.
4. Escolher entre G2 e G4 após a decisão de produto de G5. G2 tende a ampliar profundidade do tema já demonstrável; G4 amplia domínio e exige validação documental adicional.

## Regra de transição

Rayzen pode criar estas metas e acompanhar evidências. Antes de escolher uma nova fonte, ampliar a exposição pública, alterar o modelo/custo de IA ou decidir entre G2 e G4, deve solicitar decisão explícita de Marcelo. O estado de cada item deve ser refletido no backlog, no documento canônico aplicável e no registro de evidências antes de ser marcado como concluído.
