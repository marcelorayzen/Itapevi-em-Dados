# Política de artefatos gerados

## Estado atual

Em 27/10/2026, `dist/` e `node_modules/` foram removidos do índice Git, preservados apenas no ambiente local e incluídos no `.gitignore` (P0-02 concluído). Eles não devem voltar ao repositório sem uma decisão explícita de distribuição, justificativa e validação reprodutível.

## Diretriz proposta

- Código-fonte, manifests e lockfile são versionados.
- `node_modules/` não deve ser versionado em novos commits.
- `dist/` deve ser tratado como artefato de build, salvo decisão explícita de distribuição que registre motivo, plataforma e reprodutibilidade.
- Mudanças na política de artefatos exigem revisão humana e validação de clone, build e CI.

## Próximos passos

1. Confirmar em cada release que `dist/`, `node_modules/`, `.local/`, PDFs e ZIPs brutos continuam fora do diff.
2. Se uma distribuição exigir artefato versionado, registrar motivo, plataforma e processo de reprodução antes de alterar a política.
3. Executar build e CI a partir de clone limpo após qualquer mudança de ferramenta.
