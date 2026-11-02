# R0 - Validação da API pública com dados reais

## Estado validado em 02/11/2026

O domínio público `api-dados.rayzen.com.br` foi publicado com Worker Cloudflare, Hyperdrive e PostgreSQL Neon na região de São Paulo. A credencial usada pelo Worker possui apenas leitura das visões agregadas `public_api`; a leitura direta das tabelas brutas foi testada e bloqueada.

## Recortes publicados

- Estimativa populacional de Itapevi pelo indicador IBGE 29171.
- Contratos e licitações municipais carregados dos exercícios de 2024 a 2026.

## Evidência operacional

- 211 contratos, 419 licitações e 55 vínculos de alta confiança.
- Consulta humana pelo portal confirmou: Secretaria Infraestrutura e Serv.urbanos, R$ 250.078.282,41, 42 contratos.
- Worker publicado na versão `ab131e22-0b24-40cf-8326-92f1a1fc91b7`.

## Limites e controles

- Respostas exibem fonte, dataset, checksum, cobertura e limitações.
- A API não declara fraude, irregularidade, favorecimento ou culpa.
- Dados brutos e artefatos ZIP permanecem fora do repositório e da API pública.
- TLS do Hyperdrive usa `require`, autorizado apenas para validação do produto; validação institucional exige configuração de CA.

## Próximos critérios

1. Página de evidência por resposta e checksum completo.
2. Execução formal da avaliação R0-09.
3. Ingestão governada de previsto x realizado antes de expor esse tema.
