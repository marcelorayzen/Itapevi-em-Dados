# Plano de desenvolvimento — piloto de perguntas naturais

## Objetivo

Permitir que uma pessoa formule perguntas naturais sobre os dados públicos já governados, sem transformar o modelo de linguagem em fonte de fatos. O modelo interpreta a intenção; PostgreSQL e as evidências produzem os fatos.

## Decisão de piloto

- **Provedor:** Cloudflare Workers AI, já vinculado ao Worker público.
- **Modelo inicial:** `@cf/meta/llama-3.1-8b-instruct`, para classificação e extração estruturada.
- **Custo do piloto:** franquia gratuita de 10.000 neurons/dia do Workers AI; ao atingir o limite diário, a consulta deve continuar pela rota determinística ou responder indisponibilidade, sem gerar cobrança implícita.
- **Formato:** JSON estruturado validado no Worker. JSON inválido, intenção fora do catálogo ou filtro ambíguo não executam SQL.

Workers AI oferece modo JSON, mas o próprio provedor informa que o modelo pode não cumprir o esquema em todos os casos. Por isso a validação local é obrigatória antes da consulta.

## Princípios inegociáveis

1. O LLM não recebe credenciais, ZIPs, PDFs brutos, CPF, perguntas de outros usuários ou acesso direto ao banco.
2. O LLM não gera SQL livre; ele escolhe apenas entre intenções e filtros permitidos.
3. Toda resposta continua contendo fonte, período, dataset, checksum, cobertura e limites.
4. Perguntas acusatórias, pessoais, sem fonte ou fora da cobertura continuam bloqueadas.
5. Nenhuma pergunta do usuário é registrada em telemetria por padrão.

## Arquitetura do fluxo

```text
Pergunta do cidadão
       ↓
Turnstile + limite de requisição
       ↓
Classificador estruturado (Workers AI)
       ↓
Validador de intenção e filtros permitidos
       ↓
Consulta parametrizada nas visões public_api
       ↓
Resposta determinística + evidências
```

## Catálogo inicial de intenções

| Intenção | Filtros aceitos no piloto | Resposta |
|---|---|---|
| `population` | ano, quando disponível | estimativa IBGE |
| `budget_by_body` | secretaria/órgão, exercício e período coberto | previsto × realizado |
| `procurement_summary` | período coberto, modalidade quando houver fato publicado | totais de licitações |
| `contract_summary` | secretaria/órgão | contratos agregados |
| `health_unit_monthly` | pronto-socorro ou SAMU, mês e ano | valores mensais com vínculo explícito |
| `not_available` | nenhum | explicação clara e sugestão de escopo |

O classificador não poderá devolver `empresa vencedora`, `fraude`, `regularidade`, `culpa`, pessoa física ou qualquer intenção que não apareça nesta tabela.

## Etapas e checklist

### N1 — Contrato de interpretação

- [ ] Definir esquema JSON de intenção, entidade, período e nível de confiança.
- [ ] Criar validador Zod com lista fechada de intenções e filtros.
- [ ] Implementar fallback determinístico para JSON inválido, baixa confiança e indisponibilidade do modelo.
- [ ] Adicionar teste de prompt injection e tentativa de SQL livre.

**Aceite:** nenhuma saída do modelo chega ao banco sem validação local.

### N2 — Roteador semântico

- [ ] Adicionar chamada ao Workers AI apenas para perguntas que não correspondam às regras determinísticas atuais.
- [ ] Converter o JSON validado em chamada de função interna, não em SQL construído pelo modelo.
- [ ] Reaproveitar as mesmas funções de evidência, limites e linguagem não acusatória.
- [ ] Exibir indisponibilidade explicável quando faltar período, órgão ou unidade necessários.

**Aceite:** perguntas como “quais órgãos recebem orçamento?” resultam em uma intenção clara ou em pedido objetivo de esclarecimento; nunca retornam outro órgão por padrão.

### N3 — Cobertura real de orçamento

- [ ] Criar consulta agregada que liste órgãos disponíveis no recorte, em vez de escolher o maior valor.
- [ ] Permitir filtro por órgão/secretaria normalizado e exercício coberto.
- [ ] Adicionar respostas para “quais órgãos”, “quanto foi previsto” e “quanto foi realizado”.
- [ ] Testar Saúde, Educação e órgão inexistente.

**Aceite:** a pergunta de saúde retorna Saúde ou indisponibilidade para Saúde; jamais Educação.

### N4 — Avaliação antes de abrir a IA

- [ ] Criar conjunto de pelo menos 40 perguntas reais anonimizadas de cidadãos, vereadores, prefeitura e BBSIA.
- [ ] Classificar cada resultado como correto, esclarecimento adequado, indisponibilidade adequada ou falha.
- [ ] Definir meta inicial: pelo menos 90% de respostas corretas/adequadas; 0% de fatos sem evidência.
- [ ] Registrar falhas como itens de backlog, não como ajustes de prompt ocultos.

**Aceite:** relatório reproduzível com perguntas, intenção esperada, resultado e evidência.

### N5 — Piloto monitorado

- [ ] Habilitar `AI_PILOT_ENABLED=true` apenas após N1–N4.
- [ ] Exibir no portal que a pergunta foi interpretada automaticamente, mantendo os fatos como dados publicados.
- [ ] Monitorar somente métricas agregadas: consultas, intenção, resultado e falha técnica; não guardar pergunta ou IP.
- [ ] Definir limite diário de uso e resposta de degradação quando a franquia acabar.

**Aceite:** uma semana de teste com revisão semanal Marcelo/Rayzen e sem aumento de escopo não aprovado.

### N6 — Consolidação

- [ ] Revisar feedback público e métricas agregadas.
- [ ] Publicar matriz de cobertura e exemplos de perguntas atendidas/não atendidas.
- [ ] Decidir: continuar no gratuito, contratar capacidade ou manter rota determinística.

**Aceite:** decisão registrada em ADR e documentação pública atualizada.

## Ordem de execução

`N1 → N2 → N3 → N4 → N5 → N6`.

N1–N4 são desenvolvimento e avaliação controlados. N5 altera o comportamento público e exige sua aprovação explícita no momento de ativar `AI_PILOT_ENABLED`.

## Riscos e respostas

| Risco | Controle |
|---|---|
| Resposta JSON inválida | Validar esquema; não consultar banco; fallback seguro. |
| Pergunta ambígua | Pedir órgão, mês ou ano; nunca supor. |
| Franquia gratuita esgotada | Fallback determinístico ou indisponibilidade, sem cobrança automática. |
| Alucinação | Modelo não formula fatos nem SQL; resposta usa somente agregados retornados. |
| Pergunta sensível/acusatória | Regras bloqueiam e explicam limites. |

## Autorizações necessárias por etapa

- **Já autorizado:** desenvolvimento, testes, pesquisa pública, coleta de dados públicos e deploy após testes.
- **Necessário no futuro:** ativar `AI_PILOT_ENABLED=true` para usuários públicos após relatório N4.
- **Necessário se houver custo:** qualquer mudança de plano, modelo pago ou aumento deliberado de franquia.

## Fontes técnicas

- [Workers AI — preços e franquia](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Workers AI — modo JSON](https://developers.cloudflare.com/workers-ai/features/json-mode/)
