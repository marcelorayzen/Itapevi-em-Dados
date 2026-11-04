# Decisão de IA para o piloto público

## Problema a resolver

O portal deve aceitar linguagem natural, mas a resposta precisa continuar limitada a dados publicados, calculáveis e citáveis. Um modelo de linguagem melhora a compreensão de perguntas e a redação; ele não substitui a ingestão, o banco, a governança de fontes nem a evidência.

## Arquitetura obrigatória

```text
Pergunta do cidadão
  -> validação e proteção contra abuso
  -> roteador de intenção permitido
  -> consulta determinística ao catálogo aprovado
  -> pacote de evidências estruturado
  -> modelo opcional redige somente a partir desse pacote
  -> resposta + fonte + período + filtros + limites
```

O modelo não recebe credenciais de fontes, não executa SQL arbitrário, não lê arquivos locais nem pode publicar dados. Se não houver evidência suficiente, a resposta é uma recusa clara ou um pedido de refinamento.

## Opção recomendada para testes: Workers AI no Cloudflare

O projeto já possui um Worker e domínio no Cloudflare. A proposta é usar um modelo disponível no plano gratuito apenas depois de habilitar a ligação `AI` no Worker, com orçamento técnico de perguntas por dia e fallback determinístico.

Vantagens:

- sem chave de provedor exposta no navegador;
- o modelo fica atrás do Worker já usado pelo portal;
- o piloto continua operacional quando o modelo estiver indisponível, pois as consultas prioritárias são determinísticas;
- uso inicial pode caber na franquia gratuita, desde que seja monitorado e limitado.

Limites:

- a franquia e os modelos disponíveis podem mudar;
- não é garantia de capacidade ou qualidade de produção;
- esgotada a franquia, o portal deve responder sem IA, preservando a consulta e a evidência;
- ativar a integração e publicar um novo Worker exige revisão humana pelo ApprovalGate.

## OpenAI/Codex: o que é e o que não é adequado

O login usado no Codex é apropriado para uma pessoa usar o Codex localmente. Ele não deve ser transformado em credencial embutida no site público, nem compartilhado entre visitantes. Para uma aplicação web, a integração correta é uma chave de projeto da API mantida exclusivamente no servidor/Worker, com orçamento e limites próprios.

Caso a conta seja elegível, créditos da API associados a ChatGPT Pro ou Business podem ser vinculados a uma organização da API e usados para testes. Isso continua sendo uma integração de API separada; não converte a sessão do Codex em backend público e não deve expor token ou arquivo de autenticação.

## Decisão registrada

Marcelo aprovou **Workers AI gratuito para piloto**. A implementação atual usa `@cf/meta/llama-3.1-8b-instruct` apenas para classificar intenções estruturadas; Zod valida a saída antes de qualquer função interna, e o modelo não produz fatos nem SQL.

Turnstile e rate limit estão publicados. A variável `AI_PILOT_ENABLED` permanece `false`: a ativação pública está bloqueada até a avaliação N4 com 40 perguntas reais anonimizadas e a decisão formal de Marcelo/Rayzen. O roteiro vigente está em [NATURAL_LANGUAGE_PILOT_PLAN.md](NATURAL_LANGUAGE_PILOT_PLAN.md).

## Próxima decisão necessária

Após N4, Marcelo e Rayzen devem decidir se ativam o piloto Workers AI com a capacidade gratuita existente, mantêm a rota determinística ou adotam um provedor com orçamento explícito. A credencial do Codex/ChatGPT não será usada como backend do produto.
