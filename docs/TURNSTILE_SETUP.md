# Proteção Turnstile para consultas públicas

## Objetivo

O Turnstile reduz automação abusiva antes que uma pergunta chegue ao Worker ou consuma a quota do Workers AI. Ele não cria conta, não identifica o cidadão no produto e não substitui limites de requisição ou monitoramento.

## Estado do código

O portal busca `GET /v1/public-config`. Quando `TURNSTILE_ENABLED=true`, o Worker entrega somente a chave pública e o navegador mostra o widget gerenciado. Em `POST /v1/ask`, o Worker exige o token e valida no endpoint Siteverify da Cloudflare antes de consultar qualquer fonte ou modelo.

A chave secreta fica apenas como secret do Worker, em `TURNSTILE_SECRET_KEY`. Ela nunca deve ser adicionada a `.env`, ao Git, ao HTML ou a mensagens de chat.

Em 31/10/2026, a sitekey pública de produção foi recebida e registrada na configuração do Worker. O segredo e a ativação continuam pendentes.

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
- A ativação não deve ocorrer junto da IA pública antes da revisão de R0-10 e do deploy humano aprovado.
