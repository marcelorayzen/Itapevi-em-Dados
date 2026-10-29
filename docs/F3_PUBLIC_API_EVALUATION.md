# F3 - Avaliação de API pública

## Estado da decisão

**Decisão registrada:** preparar prévia privada, autenticada e somente leitura. Não existe API pública, deploy externo, chave real de acesso ou compromisso de disponibilidade nesta etapa.

## Situação atual

As rotas `GET /api/demo/*` existem apenas para a demonstração local e leem o PostgreSQL de desenvolvimento. Elas não possuem autenticação, limitação de requisições, versão pública, contrato OpenAPI, monitoramento externo ou política de suporte.

Os datasets atuais também permanecem em estado `candidate` e suas fontes têm termos de redistribuição `pending_review`. Portanto, expor essas respostas como API pública violaria a separação entre código aberto e governança de dados definida pelos ADRs 008 e 010.

## Riscos identificados

| Risco | Estado atual | Condição para reduzir o risco |
|---|---|---|
| Redistribuição não autorizada | termos pendentes por fonte | revisão humana registrada para cada dataset exposto |
| Exposição de recorte incompleto | cobertura piloto | allowlist de endpoints agregados, com `coverage`, `limitations` e evidência obrigatórias |
| Abuso e indisponibilidade | sem rate limit | gateway com limite por chave e IP, métricas e resposta `429` |
| Acesso não governado | sem autenticação | autenticação para prévia privada; papéis e revogação documentados |
| Contrato instável | contrato interno `1.0` | OpenAPI versionado, compatibilidade e política de descontinuação |
| Operação sem dono | servidor local | responsável, monitoramento, logs, backup e plano de reversão aprovados |

## Alternativas consideradas

### A. Abrir API pública agora

Rejeitada nesta etapa. Não há autorização de redistribuição por fonte nem controles operacionais mínimos.

### B. Manter somente demonstração local

É o estado atual seguro. Permite validação de dados, interface e evidências sem exposição externa.

### C. Prévia privada e somente leitura

Alternativa recomendada quando houver interesse institucional concreto. A prévia atenderia Marcelo, Rayzen e organizações convidadas, com autenticação por chave revogável, limite inicial conservador de 30 requisições por minuto por chave e somente endpoints agregados aprovados. Ela não seria uma API pública.

## Requisitos antes de qualquer prévia externa

1. Aprovar explicitamente quais datasets e campos podem ser expostos; somente artefatos com `approved_for_publication` podem entrar na allowlist.
2. Concluir termos/licenças e atribuição da fonte para cada dataset.
3. Implementar autenticação, rate limit, logs de acesso minimizados, CORS restritivo e limites de tamanho/paginação.
4. Publicar OpenAPI com exemplos que preservem evidência, cobertura, limitações e confiança do contrato `1.0`.
5. Criar testes de autorização, `429`, CORS, enumeração de recursos e não exposição de `storage_ref`, documentos brutos ou dados pessoais.
6. Definir responsável operacional, canal de suporte, janela de manutenção, backup, retenção de logs e reversão.
7. Passar pelo ApprovalGate humano antes de qualquer deploy.

## Decisão necessária

Marcelo deve escolher uma das opções:

1. **Adiar**: manter apenas demonstração local até a revisão de fontes e termos.
2. **Preparar prévia privada**: implementar controles, sem abrir acesso externo até novo ApprovalGate.
3. **Planejar API pública**: somente como roadmap, após os requisitos acima e uma decisão institucional de publicação.

Marcelo aprovou a opção 2 em 29/10/2026. A implementação preparatória e seus limites estão em `docs/F3_PRIVATE_PREVIEW_VALIDATION.md`; qualquer ativação externa continua bloqueada pelos requisitos desta avaliação.
