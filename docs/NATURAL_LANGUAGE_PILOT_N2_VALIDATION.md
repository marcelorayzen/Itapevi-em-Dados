# Validacao N2 - roteador semantico governado

**Status:** concluida em 03/11/2026. A interpretacao por IA permanece desativada para usuarios publicos enquanto `AI_PILOT_ENABLED=false`.

## Fluxo implementado

1. Perguntas que correspondem a uma regra segura existente usam a rota deterministica.
2. Apenas perguntas sem rota deterministica podem ser enviadas ao classificador estruturado.
3. Somente uma intencao aprovada pelo contrato N1 pode acionar uma funcao interna.
4. A funcao interna usa consultas parametrizadas e continua produzindo fonte, dataset, checksum, cobertura e limites.
5. Sem intencao valida, o banco nao e consultado e a resposta informa a indisponibilidade de forma explicavel.

## Controles adicionais

- Perguntas acusatorias sao recusadas antes de qualquer consulta ao banco.
- Uma pergunta generica sobre orgaos e orcamento nao seleciona mais um orgao pelo maior valor.
- O filtro de Saude ou Educacao, quando explicitamente informado, e convertido em um identificador permitido; o modelo nao escolhe texto SQL nem campos livres.
- Perguntas por unidade de saude continuam exigindo mes e ano.

## Evidencia de teste

Os testes automatizados verificam que uma intencao valida chega ao leitor de fatos, uma intencao invalida nao chega, e uma pergunta acusatoria tambem nao. O empacotamento do Worker foi validado com `wrangler deploy --dry-run`; a configuracao exibiu `AI_PILOT_ENABLED ("false")`.

## Limite desta etapa

N2 conecta o classificador ao roteamento interno, mas nao habilita a IA publica. A proxima etapa, N3, cria a listagem real de orgaos orcamentarios para responder perguntas como "quais orgaos recebem orcamento?" com dados publicados, em vez de uma solicitacao de esclarecimento.
