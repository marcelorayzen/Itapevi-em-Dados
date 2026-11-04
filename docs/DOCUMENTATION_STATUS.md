# Governanca da documentacao

**Ultima conciliacao:** 03/11/2026
**Escopo:** estado publicado, backlog, operacao e registros historicos do Itapevi em Dados.

## Fonte de verdade para cada assunto

| Assunto | Documento canonico |
|---|---|
| Estado do produto publico | [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md) |
| Capacidades e limites publicados | [CAPABILITIES.md](CAPABILITIES.md) |
| Backlog e estado das tarefas | [BACKLOG.md](BACKLOG.md) |
| Plano de execucao | [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) |
| Uso do portal e reproducao | [USER_MANUAL.md](USER_MANUAL.md) e [PUBLIC_AUDIT_TRAIL.md](PUBLIC_AUDIT_TRAIL.md) |
| Operacao, seguranca e release | [OPERATIONS.md](OPERATIONS.md) |
| Decisoes arquiteturais | [adr/README.md](adr/README.md) |

## Como ler os registros historicos

Validacoes, avaliacoes de alternativas, snapshots de checkout e planos substituidos preservam a data e o contexto em que foram produzidos. Eles nao descrevem, por si, o estado atual. Quando houver conflito, prevalecem os documentos da tabela acima e o codigo testado da revisao publicada.

## Regra de manutenção

Uma mudança de capacidade, fonte, cobertura, controle público ou deploy precisa atualizar, na mesma alteração: estado público, capacidades, backlog, plano operacional e manual quando afetar o uso. Registros de validação anteriores não devem ser apagados; devem receber referência para o documento vigente quando puderem induzir uma leitura atual incorreta.

O comando `npm run docs:check` localiza links locais quebrados na documentação versionada. A inclusão obrigatória dessa checagem no CI está registrada em P0-08. A ferramenta não avalia se uma afirmação está atualizada: essa revisão continua obrigatória quando há mudança de produto ou de fonte.
