# Operação e segurança

## Serviços

| Componente | Responsabilidade |
|---|---|
| PostgreSQL Neon | Fatos, proveniência, evidências e visões públicas. |
| Cloudflare Hyperdrive | Conexão gerenciada do Worker ao PostgreSQL. |
| Cloudflare Worker | API pública, rate limit, Turnstile e roteamento determinístico. |
| GitHub Pages | Portal estático de consulta. |

## Limites de acesso

A API pública usa conta de leitura limitada ao schema `public_api`. Tabelas brutas e artefatos locais não são acessíveis pelo Worker.

## Rotina de alteração

1. Registrar artefato, checksum e filtros.
2. Normalizar e reconciliar fatos.
3. Criar visão agregada restrita.
4. Testar respostas, recusas e permissões.
5. Publicar somente após revisão humana.
