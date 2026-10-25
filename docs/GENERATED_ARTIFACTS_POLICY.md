# Política de artefatos gerados

## Estado atual

O repositório ainda rastreia `dist/` e `node_modules/`. A presença desses diretórios não significa que a política está aprovada; ela é uma condição herdada que precisa de decisão controlada.

## Diretriz proposta

- Código-fonte, manifests e lockfile são versionados.
- `node_modules/` não deve ser versionado em novos commits.
- `dist/` deve ser tratado como artefato de build, salvo decisão explícita de distribuição que registre motivo, plataforma e reprodutibilidade.
- Nenhum diretório já rastreado será removido ou deixará de ser rastreado sem revisão e aprovação humana.

## Próximos passos

1. Comparar o conteúdo de `dist/` com um build limpo em CI.
2. Decidir se a distribuição exige artefato versionado.
3. Criar uma mudança revisável para retirar arquivos do índice, se aprovada.
4. Confirmar que o clone e o CI funcionam sem `node_modules/` versionado.
