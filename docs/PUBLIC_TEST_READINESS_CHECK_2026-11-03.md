# Check-up de prontidão para testes públicos — 03/11/2026

## Resultado

O projeto está apto para a rodada controlada de testes com pessoas externas, com as ressalvas de cobertura descritas no portal e neste documento.

## Verificações concluídas

| Área | Resultado | Evidência |
|---|---|---|
| Integridade do repositório | Aprovada | `git fsck --no-reflogs` sem inconsistências. |
| Núcleo | Aprovado | 16 suítes e 30 testes Jest aprovados. |
| Worker público | Aprovado | 10 testes Node aprovados. |
| CI anterior | Aprovado | GitHub Actions verde para `e8df807` e `3d7799b`. |
| Portal público | Disponível | `https://itapevi-em-dados.rayzen.com.br/` respondeu HTTP 200. |
| API pública | Disponível | `/health` e `/v1/public-config` responderam HTTP 200. |
| Segurança de consulta | Ativa | Turnstile, limite de 10 consultas/minuto e telemetria mínima testados. |

## Correções desta revisão

- O portal força a substituição da antiga pergunta sobre empresas vencedoras por uma pergunta compatível com os agregados publicados.
- O texto renderizado não apresenta conteúdo ilustrativo como se fosse dado real.
- Consulta orçamentária por secretaria respeita o órgão pedido; Saúde não pode retornar Educação.
- O CI valida núcleo e Worker em jobs separados.

## Escopo atual para avaliadores

1. População de Itapevi.
2. Totais agregados de contratos e licitações no recorte publicado.
3. Previsto × realizado por secretaria, conforme período informado na evidência.
4. Pagamentos mensais com vínculo explícito a pronto-socorro ou SAMU.

## Limites que devem permanecer claros

- Não há ranking público de empresas vencedoras no catálogo atual.
- Ausência em um recorte não demonstra ausência de gasto, contrato, licitação ou serviço.
- Perguntas fora do escopo recebem indisponibilidade explicável; não são respondidas por inferência.
- A rodada de testes humanos serve para registrar dúvidas, erros percebidos e sugestões antes da próxima expansão.

## Situação de publicação

O commit `bd08cb0` iniciou uma nova execução de CI e de deploy do GitHub Pages. A confirmação final deve ser observada no GitHub Actions antes de divulgar a alteração de interface como concluída.
