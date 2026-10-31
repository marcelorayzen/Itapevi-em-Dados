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

## Decisão ainda necessária

Antes de implementar a camada de IA, Marcelo deve escolher uma das opções:

1. **Workers AI gratuito para piloto** — recomendado: sem custo planejado, quota diária, fallback determinístico e avaliação de qualidade.
2. **OpenAI API com créditos ou orçamento limitado** — melhor qualidade potencial, exige organização/API key, teto de gasto e segredo no Worker.
3. **Sem IA na primeira demonstração** — entrega consultas estruturadas, rápidas e auditáveis; a IA entra após validar dados e experiência.

Independentemente da opção, R0-03 a R0-10 continuam necessários: o modelo não pode responder sobre licitações antes de existir um dataset municipal aprovado e consultável.
