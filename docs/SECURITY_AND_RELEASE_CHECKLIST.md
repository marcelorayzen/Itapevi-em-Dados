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

_Varredura e atualização controlada em 27/10/2026. Foram atualizados MCP SDK, Zod, Axios, csv-parse e dependências transitivas; `esbuild` foi unificado por override para corrigir sua dependência transitiva do `tsx`._

| Severidade | Quantidade |
|---|---:|
| Crítica | 0 |
| Alta | 0 |
| Moderada | 0 |
| Baixa | 0 |

`npm audit` final reportou zero vulnerabilidades. Build e a suíte de quatro testes passaram após a atualização. Isso não substitui revisão humana de release, testes de integração e análise das 50 entradas sem manifesto local no inventário de licenças.
