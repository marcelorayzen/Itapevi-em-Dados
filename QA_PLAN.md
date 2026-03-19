# QA Plan - Itapevi em Dados (MCP)

## Objetivo
- Garantir qualidade, confiança e escalabilidade das ferramentas do servidor MCP.
- Criar processos claros de testes unitários, integração e e2e.
- Estabelecer análise de risco para priorizar melhorias e reduzir falha.

## 1) Ferramentas atuais de prioridade
1. buscar_despesas
2. buscar_demandas_por_bairro
3. buscar_lei
4. dados_ibge
5. buscar_licitacoes (a implementar)
6. buscar_contratos (a implementar)

## 2) Estratégia de testes
### Unitários
- Validação Zod para inputs (casos válidos e inválidos).
- Respostas de mocks para cases principais e negativos.
- Erro de interpretação (sem payload, props erradas).

### Integração
- Usa `@modelcontextprotocol/sdk` para `CallToolRequestSchema` / `ListToolsRequestSchema`.
- Verificar `server` responde `tools` com definições corretas.
- Resultado deve ter `content: [{ type, text }]`.

### E2E
- Fluxo com cliente ou CLI (ex.: `npx itapevi-em-dados call ...`).
- Simular carregamento de caixa de ferramentas e execução dos comandos.

### Regressão / Snapshots
- Armazenar respostas estabilizadas e verificar se não mudam.
- Validar após mudanças de código.

## 3) Cobertura necessária por ferramenta
### buscar_demandas_por_bairro
- bairro encontrado, bairro não encontrado e sem parametro.
- comportamentos case insensitive.

### buscar_despesas
- ano com dados e sem dados.
- mês opcional.
- formato local de moeda `pt-BR`.

### buscar_lei
- busca com resultado, sem resultado, palavra 3+.
- caracteres especiais e acentos.

### dados_ibge
- retorno fixo, campos obrigatórios.
- teste de fallback caso API externa futura falhe.

## 4) Critérios de aceitação
- `npm run build` sem erros.
- `npm test` sem erros (meta >= 95% de acerto).
- `npm run lint` sem avisos (quando adicionarmos lint).
- Cada ferramenta com docs + testes e cobertura mínima 80%.

## 5) Riscos e mitigação
- dependências externas (portal e IBGE): adicionar cache, retry (3x) e fallback.
- schema MCP: `list-tools` e `call` precisam manter compatibilidade.
- dados incompletos/desatualizados: sinalizar timestamp e versão da fonte.
- injeção e dados maliciosos: validação forte no Zod e escape.

## 6) Backlog e roadmap
- Sprint 1: testes unitários e integração para os 4 endpoints existentes + adicionar `jest`.
- Sprint 2: implementar `buscar_licitacoes` e `buscar_contratos` com mocks + reais.
- Sprint 3: scraping de retrocompatibilidade + monitoramento (logs metricas, health-check).
- Sprint 4: segurança (rate-limit, policy, threat model).

## 7) Como acompanhar
- GitHub Issues para bugs / features
- PRs com pipeline CI (build + testes)
- Documentação de cada commit / alteração no `README.md` e `QA_PLAN.md`

## 8) Implementação 2 e 3 (concluída)
- Adicionado Jest + ts-jest nos deps de desenvolvimento.
- `jest.config.js` configurado para testes com TS.
- Script de teste: `__tests__/ibge.test.ts` usando `axios-mock-adapter`.
- Adicionado `healthCheck()` em `src/health.ts` para monitoramento local.
- Criado `src/app.ts` e `__tests__/health.test.ts` para endpoint `/health` (supertest).
- Adicionado tool `buscar_licitacoes` e teste `__tests__/licitacoes.test.ts`.
- Adicionado script npm: `npm test`.

### Observações de execução
- `npm run build` passou.
- `npm start` inicializa servidor (sem erro mostrado).
- `npm test` passou com 4 suites (server, health, ibge, licitacoes).


