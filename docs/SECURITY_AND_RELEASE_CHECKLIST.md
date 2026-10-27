# Checklist de segurança e release

## Antes de abrir ou publicar alterações

- [ ] Não há credenciais, tokens, cookies, dados pessoais ou arquivos `.env` no diff.
- [ ] `.env.example` contém apenas valores de exemplo seguros.
- [ ] Fontes e dados derivados possuem registro de termos, finalidade e redistribuição.
- [ ] Build e testes foram executados com resultado registrado.
- [ ] Mudanças em conectores informam limites de fonte, cache e falha.
- [ ] Dependências novas possuem licença revisada.
- [ ] Respostas/insights não tratam placeholder como dado real e não usam linguagem acusatória.

## Antes de deploy de produção

- [ ] Evidências de teste e revisão estão disponíveis.
- [ ] O deploy passou pelo ApprovalGate com aprovação humana.
- [ ] Responsável operacional, plano de reversão e monitoramento foram definidos.
- [ ] Não há migração, coleta ou exposição de dado sem validação institucional necessária.

Este checklist não substitui exigências legais, de segurança ou de privacidade aplicáveis a cada implantação.

## Registro técnico de vulnerabilidades

_Varredura local em 27/10/2026, `npm audit --omit=dev`. Nenhuma correção automática foi aplicada._

| Severidade | Quantidade |
|---|---:|
| Crítica | 1 |
| Alta | 7 |
| Moderada | 3 |
| Baixa | 0 |

Dependências diretas afetadas: `@modelcontextprotocol/sdk`, `axios`, `csv-parse` e `zod`. Há correções indicadas pelo npm, mas sua aplicação pode atualizar versões transitivas ou diretas; a decisão e a validação de compatibilidade permanecem pendentes antes de qualquer release.
