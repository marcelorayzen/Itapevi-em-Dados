# Roadmap de produto

**Situação em 03/11/2026:** o projeto já possui portal e API públicos para recortes governados. Este roadmap mostra o que vem depois dessa base, sem reclassificar a arquitetura-alvo como funcionalidade entregue. O estado detalhado das tarefas está no [backlog](BACKLOG.md).

| Horizonte | Estado | Resultado verificável |
|---|---|---|
| Base pública verificável | Entregue, em manutenção | Portal, API, PostgreSQL, evidências e recortes agregados publicados. |
| Qualidade e validação de uso | Em andamento | Avaliação N4 com 40 perguntas reais anonimizadas e correções registradas. |
| Ampliação governada de fontes | Em andamento | Novos datasets entram com artefato, checksum, cobertura, termos e teste de resposta. |
| Document Intelligence | Parcial | Diário Oficial registrado; extração Docling integral ainda precisa de validação. |
| Conhecimento relacional | Planejado | Relações Empresa–Licitação–Contrato somente quando cada elo tiver evidência citável. |
| Território, insights e alertas | Planejado | Regras reproduzíveis, cobertura declarada e revisão humana. |
| Multi-cidade | Planejado | Segunda configuração isolada, sem fork do núcleo. |

## Próximos marcos

1. **N4 — validar perguntas naturais:** coletar e avaliar 40 perguntas anonimizadas antes de habilitar IA ao público.
2. **Ampliar dados reais com segurança:** educação, Escolas do Futuro e Diário Oficial entram somente após coleta, estrutura, proveniência e avaliação da publicação.
3. **Qualidade de fontes e operação:** completar a revisão de termos por dataset, SBOM/licenças e critérios de release.
4. **Consultas relacionais:** avaliar grafo apenas se PostgreSQL não resolver uma pergunta pública com todos os elos citáveis.
5. **Escala institucional:** testar com cidadãos, câmaras, prefeituras e BBSIA e incorporar feedback sem registrar conteúdo pessoal desnecessário.
