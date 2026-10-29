# F4 - Relatório semanal de alertas

## Decisão operacional

O destinatário inicial é **Marcelo Augusto e Rayzen**. O relatório é local, sob demanda e semanal; não há envio por e-mail, mensageria, webhook ou automação externa.

## Tipos de alerta implementados

| Categoria | Critério verificável | Severidade |
|---|---|---|
| Nova coleta | artefato registrado nos últimos sete dias | informação |
| Falha de processamento | execução `failed` finalizada nos últimos sete dias | atenção |
| Termos pendentes | fonte com `redistribution_status = pending_review` | atenção |
| Entidade pendente | alias com `needs_review` | atenção |

Cada alerta inclui referência à fonte, dataset e checksum do artefato quando aplicável. Falhas expõem o identificador da execução e o processador, não a mensagem de erro bruta.

A falha controlada do teste `f1-lifecycle-verification`, registrada para validar recuperação da F1, é excluída: ela não representa incidente operacional aberto. Falhas reais continuam incluídas.

## Tipos ainda não avaliados

- alteração de schema: depende de baseline versionado por fonte;
- variação comparativa de indicadores: depende de pelo menos dois recortes equivalentes.

Esses itens aparecem explicitamente como `notEvaluated`; o relatório não os converte em alarme por suposição.

## Como gerar

Com o PostgreSQL local em execução e `DATABASE_URL` configurada:

```powershell
npm run alerts:weekly
```

O resultado é JSON no contrato comum `1.0`, adequado para revisão humana e para futura integração governada. Ele não agenda execução, não envia notificações e não faz alegações sobre conduta, irregularidade ou responsabilidade.

## Revogação e evolução

Para interromper a rotina, basta não executar o comando: não há job persistente. Qualquer futuro agendamento, canal externo, mudança de destinatário ou alerta de risco exige nova aprovação humana e revisão de segurança, privacidade e termos.
