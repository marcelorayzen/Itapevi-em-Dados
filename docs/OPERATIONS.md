# Operação e segurança

**Referência de estado:** [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md). Esta página descreve a operação publicada; procedimentos de prévia privada são históricos e não configuram o ambiente atual.

## Serviços

| Componente | Responsabilidade |
|---|---|
| PostgreSQL Neon | Fatos, proveniência, evidências e visões públicas. |
| Cloudflare Hyperdrive | Conexão gerenciada do Worker ao PostgreSQL. |
| Cloudflare Worker | API pública, rate limit, Turnstile e roteamento determinístico. |
| GitHub Pages | Portal estático de consulta em `itapevi-em-dados.rayzen.com.br`. |

## Limites de acesso

A API pública usa conta de leitura limitada ao schema `public_api`. Tabelas brutas, documentos e artefatos locais não são acessíveis pelo Worker. Turnstile e limite de requisições são verificados antes da consulta; a telemetria do piloto é somente agregada e não registra pergunta, IP, token ou resposta.

## Rotina de alteração

1. Registrar artefato, checksum e filtros.
2. Normalizar e reconciliar fatos.
3. Criar visão agregada restrita.
4. Testar respostas, recusas e permissões.
5. Atualizar a documentação canônica: estado público, capacidades, fontes, backlog e manual quando aplicável.
6. Publicar somente após revisão humana e validar `GET /health`, uma pergunta factual, uma recusa segura e a trilha de auditoria.

## Qualidade contínua

O CI separa os testes do núcleo TypeScript dos testes do Worker público e executa `npm run docs:check` no job do núcleo para impedir links locais quebrados na documentação versionada. A checagem de links não substitui revisão humana do conteúdo, da fonte ou da condição de uso.
