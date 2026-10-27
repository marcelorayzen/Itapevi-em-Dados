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
| F2-01 | P2 | Resolução de entidades | F1-05 | [x] |
| F2-02 | P2 | Prova de necessidade do grafo | F2-01 | [x] |
| F2-03 | P2 | Projeção relacional, se aprovada | F2-02 | [ ] |
| F2-04 | P2 | Consulta citável com evidências | F2-01 | [x] |
| F3-01 | P2 | Contrato de resposta comum | F1-05 | [x] |
| F3-02 | P2 | Catálogo navegável de datasets | F1-05 | [x] |
| F3-04 | P2 | Interface web de consulta e demonstração para prefeituras e BBSIA | F3-01, F3-02 | [x] |
| F4-01 | P2 | Regra de insight reproduzível | F1-06 | [ ] |
| F5-01 | P3 | Configuração multi-cidade | F1-02 | [ ] |

## Registro de bloqueios

| Data | Item | Bloqueio | Próxima ação | Responsável |
|---|---|---|---|---|
| — | — | — | — | — |

## Registro de decisões operacionais

| Data | Decisão | Evidência/ADR | Impacto |
|---|---|---|---|
| — | — | — | — |
