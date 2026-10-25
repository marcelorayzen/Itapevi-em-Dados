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
