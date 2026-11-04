# R0 — Validação da camada de IA do piloto

> **Registro histórico de 31/10/2026.** O estado atual usa `@cf/meta/llama-3.1-8b-instruct`, contrato JSON fechado, validação Zod, Turnstile e rate limit. A IA continua desativada ao público. Consulte o [plano vigente](NATURAL_LANGUAGE_PILOT_PLAN.md) e o [estado atual](CURRENT_PUBLIC_PRODUCT_STATUS.md).

## Escopo implementado

Em 31/10/2026 foi preparada a integração opcional do Cloudflare Workers AI no Worker público. O modelo escolhido para o experimento é `@cf/google/gemma-4-26b-a4b-it`, acessado exclusivamente pela binding `env.AI`.

O uso foi deliberadamente limitado à classificação de intenção:

- reconhecer uma pergunta livre sobre população de Itapevi;
- devolver apenas `population` ou `not_available`;
- acionar a mesma consulta oficial IBGE já existente quando a intenção for permitida;
- nunca consultar banco, arquivo, URL adicional, documento bruto ou dado municipal pendente;
- manter o roteamento determinístico como fallback.

O modelo não redige fatos novos nesta etapa. Isso reduz a superfície de erro enquanto a avaliação e os datasets municipais ainda não foram concluídos.

## Evidência de teste

Comando executado no diretório `cloudflare-worker/`:

```powershell
npm test
npx wrangler deploy --dry-run --config wrangler.jsonc
```

Resultado em 31/10/2026:

- 4 testes aprovados;
- classificação de formulação livre de população aprovada;
- instrução adversarial sobre licitações retornou `not_available`;
- bundle de deploy validado com binding `env.AI`;
- `AI_PILOT_ENABLED` permanece `false`.

## Estado de publicação

**Não implantado como IA ativa em produção.** A configuração e o código estão prontos para revisão, mas a ativação depende de R0-10:

1. definir e testar limite de requisições efetivo;
2. registrar telemetria mínima, sem conteúdo de pergunta nem dado pessoal desnecessário;
3. validar comportamento de quota esgotada, indisponibilidade do modelo e fallback;
4. submeter o deploy ao ApprovalGate humano.

Mesmo depois da ativação, o único tema permitido será população agregada do IBGE até que os datasets municipais tenham condição de publicação documentada.
