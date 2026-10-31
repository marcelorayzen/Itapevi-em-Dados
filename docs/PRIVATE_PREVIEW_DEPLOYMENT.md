# Preparacao da previa privada em subdominio

## Finalidade

A previa privada e o segundo ambiente de demonstracao do projeto. Ela permite que convidados autorizados testem consultas com datasets explicitamente liberados, sem transformar o ambiente local em servico publico.

Ela e diferente da demonstracao no GitHub Pages:

| Ambiente | Conteudo | Acesso |
|---|---|---|
| GitHub Pages | Interface e dados ilustrativos | Publico |
| Previa privada | Apenas dados agregados aprovados | Convidados com chave individual |
| Producao | Escopo aprovado por instituicao | Futuro |

## O que ja esta preparado

A rota GET /api/preview/v1/catalog existe no codigo e permanece desligada por padrao. Quando habilitada, exige:

- PREVIEW_API_ENABLED=true;
- chave Bearer cujo hash SHA-256 esteja em PREVIEW_API_KEY_HASHES;
- origem permitida em PREVIEW_ALLOWED_ORIGINS;
- limite de requisicoes configurado;
- dataset ativo, origem permitida e artefato aprovado para publicacao.

Nenhuma chave, dominio, origem externa ou dataset publico foi configurado neste repositorio.

## Decisoes necessarias antes de ativar

1. Definir provedor de hospedagem e responsavel operacional.
2. Escolher o subdominio, por exemplo preview.seudominio.org.
3. Configurar DNS e HTTPS no provedor escolhido.
4. Definir os convidados e a validade de cada chave.
5. Aprovar os datasets, campos, periodos e limites que poderao aparecer.
6. Registrar termos, atribuicao e condicao de redistribuicao de cada fonte.
7. Definir logs, canal de suporte, monitoramento e procedimento de revogacao.
8. Aprovar a ativacao pelo ApprovalGate humano.

## Configuracao por ambiente

Nunca coloque chaves reais no Git, README, issue ou print de tela.

Exemplo de arquivo de ambiente do servidor:

```dotenv
PREVIEW_API_ENABLED=true
PREVIEW_API_KEY_HASHES=<hash-sha256-de-uma-chave-revogavel>
PREVIEW_ALLOWED_ORIGINS=https://preview.seudominio.org
PREVIEW_RATE_LIMIT_PER_MINUTE=30
DATABASE_URL=<url-do-banco-isolado-do-ambiente>
```

Cada convidado recebe uma chave diferente. A chave bruta e entregue por canal apropriado; somente seu hash entra na configuracao do servidor. Em caso de perda, encerre a chave removendo seu hash e gere outra.

## Checklist de ativacao

- [ ] O dominio e o provedor foram aprovados.
- [ ] HTTPS esta valido e a origem permitida corresponde exatamente ao subdominio.
- [ ] Banco e credenciais do ambiente de previa sao isolados do ambiente local.
- [ ] Os datasets foram liberados por fonte, campo e periodo.
- [ ] Termos, atribuicao e redistribuicao foram revisados e registrados.
- [ ] Chaves individuais foram criadas, entregues e testadas sem aparecer em logs.
- [ ] Limite de requisicoes, logs e canal de suporte foram testados.
- [ ] Rota sem token, token invalido, origem invalida e limite excedido retornam erro seguro.
- [ ] Roteiro de avaliacao, responsavel e data de encerramento foram registrados.
- [ ] ApprovalGate humano aprovou a ativacao.

## Reversao

Para encerrar a previa, primeiro defina PREVIEW_API_ENABLED=false, revogue as chaves e remova a origem permitida. Depois preserve apenas os logs necessarios para auditoria, conforme a politica definida para o ambiente. A demo estatica publica nao e afetada por essa reversao porque ela nao chama a API privada.

