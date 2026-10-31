# Proteção Turnstile para consultas públicas

## Objetivo

O Turnstile reduz automação abusiva antes que uma pergunta chegue ao Worker ou consuma a quota do Workers AI. Ele não cria conta, não identifica o cidadão no produto e não substitui limites de requisição ou monitoramento.

## Estado do código

O portal busca `GET /v1/public-config`. Quando `TURNSTILE_ENABLED=true`, o Worker entrega somente a chave pública e o navegador mostra o widget gerenciado. Em `POST /v1/ask`, o Worker exige o token e valida no endpoint Siteverify da Cloudflare antes de consultar qualquer fonte ou modelo.

A chave secreta fica apenas como secret do Worker, em `TURNSTILE_SECRET_KEY`. Ela nunca deve ser adicionada a `.env`, ao Git, ao HTML ou a mensagens de chat.

Em 31/10/2026, a sitekey pública de produção foi recebida e registrada na configuração do Worker. O segredo foi inserido interativamente pelo responsável, sem ser revelado ao projeto. A proteção foi implantada no Worker `itapevi-em-dados-public-api`, versão `cd2396bd-54ef-4956-85fe-9762b9ac8cf0`.

Validação externa após o deploy:

- `GET /v1/public-config` retornou `turnstileEnabled: true` e a sitekey pública;
- uma pergunta sem token recebeu `403` com `verification_required`;
- o portal público respondeu `200` e contém o script oficial do Turnstile.
- o responsável realizou em navegador uma pergunta populacional após o desafio e confirmou que recebeu a resposta esperada.

## Ativação de produção

No painel Cloudflare:

1. Abra **Turnstile** e crie o widget `itapevi-em-dados-public-api` em modo gerenciado.
2. Restrinja o hostname a `itapevi-em-dados.rayzen.com.br`.
3. Guarde a **sitekey** em `TURNSTILE_SITE_KEY` como variável do Worker.
4. Guarde a **secret key** pelo comando interativo abaixo; não a cole no repositório:

```powershell
cd C:\Users\marce\Projects\Itapevi-em-Dados\cloudflare-worker
npx wrangler secret put TURNSTILE_SECRET_KEY
```

5. Altere `TURNSTILE_ENABLED` para `true` somente no ambiente de produção.
6. Faça o deploy pelo ApprovalGate, teste uma pergunta válida, teste token ausente e confirme que o segredo não aparece na resposta ou nos logs.

## Testes

Os testes unitários simulam a validação do servidor e confirmam que o hostname precisa ser o domínio público esperado. As chaves de teste oficiais da Cloudflare servem apenas para desenvolvimento e não devem ser configuradas em produção.

## Limites conhecidos

- Tokens expiram em cinco minutos e são de uso único.
- O Turnstile verifica que há um navegador legítimo; ele não define a licença de um dataset nem permite consultas fora da allowlist.
- O Turnstile é a primeira parte de R0-10. Limite de requisições e telemetria mínima ainda precisam ser implementados antes de ativar a IA pública.

## Limite de requisições

Em 31/10/2026, Marcelo aprovou o limite inicial de dez perguntas por minuto por origem. O Worker usa a binding nativa `PUBLIC_QUERY_RATE_LIMITER` do Cloudflare antes de chamar Turnstile, IBGE ou Workers AI.

- A origem é transformada localmente em hash SHA-256 para a chave do limitador; o projeto não grava IP ou pergunta em logs próprios.
- Quando o limite é atingido, a API retorna `429 rate_limited` e orienta aguardar um minuto.
- Se a binding configurada falhar, a API fecha a consulta com `503 rate_limit_unavailable`; não libera o caminho sem proteção.
- O contador do Cloudflare é aproximado e regional. É apropriado para o piloto, mas não é um controle global estrito.
- A evidência e o limite de validação externa estão registrados em [R0_RATE_LIMIT_VALIDATION.md](R0_RATE_LIMIT_VALIDATION.md).
