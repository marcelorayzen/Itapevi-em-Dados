# F3 - Prévia privada de API

## Decisão aprovada

Em 29/10/2026, Marcelo aprovou a opção 2 da avaliação F3-03: **preparar uma prévia privada, autenticada e somente leitura**, sem deploy ou abertura externa nesta etapa.

## Implementação

A rota preparada é `GET /api/preview/v1/catalog`. Ela não reutiliza diretamente as rotas `/api/demo/*`.

Controles aplicados:

- desativada por padrão (`PREVIEW_API_ENABLED=false` ou ausente);
- exige `Authorization: Bearer <chave>`;
- guarda somente hashes SHA-256 das chaves na configuração; remover um hash revoga a chave;
- restringe CORS à lista explícita de origens;
- limita a 30 requisições por minuto por chave, com resposta `429` e `Retry-After`;
- retorna o contrato comum `1.0` também para erros de controle;
- só lista datasets cuja fonte esteja `allowed`, dataset `active` e artefato `approved_for_publication`.

Nenhum dataset atual satisfaz simultaneamente esses três estados. Assim, mesmo com a prévia habilitada localmente, a resposta é vazia e informa a limitação; dados candidatos, documentos brutos, `storage_ref` e dados pessoais permanecem fora da allowlist.

## Configuração local futura

Não crie chaves reais no repositório. Quando houver autorização institucional e ambiente isolado, configure fora do Git:

```dotenv
PREVIEW_API_ENABLED=true
PREVIEW_API_KEY_HASHES=<sha256-da-chave-revogavel>
PREVIEW_ALLOWED_ORIGINS=https://origem-convidada.example
PREVIEW_RATE_LIMIT_PER_MINUTE=30
```

Para gerar um hash sem gravar a chave em arquivo:

```powershell
node -e "console.log(require('node:crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" 'sua-chave-local'
```

## Verificações executadas

Os testes cobrem prévia desligada (`404`), ausência de chave (`401`), origem não permitida (`403`), origem permitida, limite por chave (`429`) e contrato comum de erro. O projeto passou em build e testes com 12 suítes e 23 testes.

## Limites operacionais

- Não há deploy, DNS, firewall, credenciais reais, convidados externos ou compromisso de disponibilidade.
- Não há logs de acesso persistentes nesta etapa; antes de ativação externa, definir retenção mínima, responsável e revisão de privacidade.
- A ativação externa continua condicionada a termos das fontes, allowlist de datasets, responsável operacional e ApprovalGate humano.
