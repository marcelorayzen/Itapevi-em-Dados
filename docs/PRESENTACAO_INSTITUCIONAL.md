# Itapevi em Dados

> **Observatório público de dados municipais com evidências verificáveis**  
> Material institucional para demonstração, articulação de apoio e condução do projeto.  
> **Versão:** 03/11/2026 — use o [estado atual do produto](CURRENT_PUBLIC_PRODUCT_STATUS.md) como referência canônica.

---

## Como usar esta apresentação

Este documento foi escrito para virar slides, PDF ou roteiro de reunião. Cada bloco `Slide` traz o conteúdo essencial; os blocos **Fala sugerida** ajudam a conduzir a conversa sem confundir visão de futuro com capacidade já entregue.

**Duração sugerida:**

| Contexto | Duração | Slides recomendados |
|---|---:|---|
| Apresentação executiva | 10 minutos | 1–10, 15, 18–20 |
| BBSIA, Prefeitura ou Câmara | 20 minutos | apresentação completa, com demonstração no slide 8 |
| Reunião técnica | 30–40 minutos | apresentação completa + arquitetura e documentação |

**Regra de linguagem:** sempre dizer “recorte publicado”, “piloto” e “evidência” quando apropriado. Não apresentar dados agregados como auditoria conclusiva, nem afirmar que o sistema detecta fraude, irregularidade ou responsabilidade.

---

## Slide 1 — A proposta

# Entenda a cidade. Confira a evidência.

**Itapevi em Dados** organiza fontes públicas dispersas em respostas claras, reproduzíveis e auditáveis.

- Para cidadãos: compreender uma informação sem precisar navegar por vários portais.
- Para vereadores, imprensa e pesquisadores: localizar um recorte e refazer a conferência.
- Para a Prefeitura: ampliar transparência com controle de fonte, período, cobertura e limites.
- Para parceiros institucionais: avaliar um modelo reutilizável para outras cidades.

**Portal público:** [itapevi-em-dados.rayzen.com.br](https://itapevi-em-dados.rayzen.com.br/)

**Fala sugerida:** “A proposta não é substituir os portais oficiais. É tornar os dados já públicos mais encontráveis, compreensíveis e conferíveis.”

---

## Slide 2 — O problema que resolvemos

Informação pública existe, mas frequentemente está distribuída entre portais, planilhas, PDFs, filtros pouco claros e páginas difíceis de comparar.

| Dificuldade atual | Consequência para quem consulta |
|---|---|
| Muitos sistemas e formatos | A pessoa não sabe onde procurar. |
| PDFs e tabelas complexas | O dado é difícil de reutilizar e comparar. |
| Filtros e períodos pouco visíveis | Números são interpretados fora de contexto. |
| Falta de trilha de origem | É difícil conferir ou contestar uma resposta. |
| Linguagem técnica | Transparência existe, mas não é acessível a todos. |

**Fala sugerida:** “O desafio não é só publicar. É permitir que alguém encontre, entenda e confira sem depender de conhecimento técnico.”

---

## Slide 3 — A resposta proposta

```text
Fonte oficial
      ↓
Coleta controlada e registro do artefato
      ↓
Normalização e validação
      ↓
Fatos agregados + proveniência no PostgreSQL
      ↓
API pública restrita
      ↓
Portal com resposta, evidência, período e limites
```

O resultado não é apenas um número. Cada resposta deve indicar:

- de onde veio;
- qual período e filtro foram usados;
- qual dataset e checksum sustentam o resultado;
- como a pessoa pode conferir;
- o que aquele recorte não permite concluir.

---

## Slide 4 — O que o projeto é e o que não é

| É | Não é |
|---|---|
| Observatório de dados públicos com evidências | Um chat que inventa respostas plausíveis |
| Camada de entendimento e conferência | Substituto de portal oficial ou controle interno |
| Produto de transparência e controle social | Sistema de acusação automática |
| Arquitetura reutilizável para cidades | Banco público irrestrito de documentos brutos |
| Piloto em evolução com limites visíveis | Produto concluído com cobertura total do município |

**Fala sugerida:** “A confiabilidade do projeto vem justamente de saber dizer ‘não há cobertura suficiente’ quando ela não existe.”

---

## Slide 5 — Missão e visão

### Missão

Transformar dados públicos dispersos em conhecimento confiável, compreensível e rastreável para fortalecer o controle social e decisões baseadas em evidências.

### Visão

Construir uma plataforma de observatório inteligente de cidades, onde fatos, documentos, tempo, território e relacionamentos possam ser consultados com origem verificável.

### Princípios inegociáveis

1. Fonte antes de narrativa.
2. Período e cobertura antes de comparação.
3. Evidência antes de inferência.
4. Linguagem descritiva, não acusatória.
5. Dados públicos não dispensam governança, termos de uso e proteção de dados.

---

## Slide 6 — Para quem o projeto foi pensado

| Público | Necessidade | Valor entregue |
|---|---|---|
| Cidadão | Entender um tema da cidade | Resposta simples com fonte e limite. |
| Vereador e assessor | Conferir recortes para fiscalização | Período, órgão, evidência e instrução de consulta. |
| Jornalista e pesquisador | Encontrar dados reproduzíveis | Dataset, checksum e método. |
| Prefeitura | Qualificar a transparência sem abrir dados indevidos | Agregação, controles e governança. |
| BBSIA e parceiros | Avaliar inovação pública responsável | Arquitetura, testes, ADRs e roadmap. |
| Equipe técnica | Reproduzir e manter a solução | Pipeline, documentação, testes e observabilidade. |

---

## Slide 7 — O que já está publicado

| Domínio | Cobertura publicada | Limite explícito |
|---|---|---|
| População | Estimativa oficial do IBGE para Itapevi | Não mede gasto, serviço ou qualidade urbana. |
| Contratos | Agregados municipais de 2024 a 2026 por secretaria | Não conclui execução ou regularidade. |
| Licitações | Agregados municipais de 2024 a 2026 | Não classifica conduta de empresas. |
| Execução orçamentária | Previsto e realizado por órgão nos recortes de setembro e outubro de 2026 | Meses não são somados automaticamente. |
| Saúde | Empenhos com referência explícita a pronto-socorro ou SAMU, por mês | Não inclui despesas sem vínculo explícito. |

**Mensagem-chave:** cobertura publicada não significa cobertura integral. O portal sempre declara o alcance da resposta.

---

## Slide 8 — Demonstração ao vivo: uma pergunta que pode ser conferida

1. Abra [itapevi-em-dados.rayzen.com.br](https://itapevi-em-dados.rayzen.com.br/).
2. Faça uma pergunta dentro da cobertura, por exemplo:
   - “Qual é a população de Itapevi?”
   - “Quanto foi realizado pela Secretaria de Saúde em outubro de 2026?”
   - “Quais órgãos aparecem no recorte orçamentário de setembro de 2026?”
3. Leia a resposta junto com **período**, **cobertura** e **limites**.
4. Clique em **Ver trilha de auditoria**.
5. Mostre a fonte oficial, o dataset, o checksum e como refazer a consulta.

**Importante:** se uma pergunta não possuir recorte publicado, a resposta correta é explicar a lacuna — não estimar nem improvisar.

---

## Slide 9 — Exemplo de leitura responsável

Uma resposta sobre orçamento informa valores **previstos** e **realizados** para um órgão e um período específico.

Ela não permite concluir, sozinha:

- se o órgão executou bem ou mal;
- se houve irregularidade;
- se o valor atende integralmente a uma política pública;
- se há comparação válida com outro período;
- se a ausência de linha no recorte equivale à ausência de despesa.

**Fala sugerida:** “O portal organiza fatos verificáveis. A análise de mérito, legalidade e causalidade continua exigindo contexto, documentos e revisão humana.”

---

## Slide 10 — A evidência é parte da resposta

```text
Pergunta
  ↓
Resposta factual
  ├─ Fonte oficial
  ├─ Identificador da fonte e dataset
  ├─ Período e filtro
  ├─ Checksum do artefato
  ├─ Cobertura e limitações
  └─ Passo a passo de conferência
```

Essa estrutura protege tanto quem consulta quanto quem publica: permite questionar, corrigir e melhorar o resultado de modo objetivo.

---

## Slide 11 — Arquitetura em produção hoje

```text
Fontes oficiais e exportações públicas
          ↓
Coleta e normalização controladas
          ↓
PostgreSQL Neon
  fatos + proveniência + evidências
          ↓
Visões públicas agregadas e restritas
          ↓
Cloudflare Worker + Hyperdrive
          ↓
Portal público + API de perguntas
```

### Controles técnicos já aplicados

- documentos brutos e tabelas internas não são expostos pela API pública;
- API consulta visões agregadas, não tabelas operacionais;
- HTTPS, Turnstile e limite de requisições protegem a entrada;
- testes automatizados, tipagem e verificação de links fazem parte do ciclo de entrega;
- cada artefato pode ter checksum, execução de processamento e evidência associados.

---

## Slide 12 — IA: onde ela ajuda e onde ela não decide

O piloto usa IA de forma controlada para interpretar perguntas em linguagem natural.

```text
Pergunta do usuário
       ↓
Turnstile + limite de requisições
       ↓
Classificador de intenção com contrato fechado
       ↓
Validação Zod + filtros permitidos
       ↓
Consulta parametrizada a dados publicados
       ↓
Resposta com evidência, cobertura e limites
```

### A IA não pode

- criar fatos ou números;
- executar SQL livre;
- consultar PDFs brutos, credenciais ou dados pessoais;
- ampliar temas fora do catálogo;
- concluir fraude, culpa, favorecimento ou irregularidade.

**Estado:** piloto público monitorado, com avaliação de perguntas reais em andamento.

---

## Slide 13 — Governança de dados e responsabilidade pública

| Tema | Regra adotada |
|---|---|
| Código | Apache-2.0. |
| Dados | Cada fonte possui termos, origem e condição de uso próprios. |
| Proveniência | Fonte, URL, coleta, checksum, transformação e versão quando disponíveis. |
| Dados pessoais | Minimização; não exposição de tabelas brutas sem justificativa e revisão. |
| Comunicação | Insights são descritivos, reproduzíveis e não acusatórios. |
| Publicação | Novo recorte só entra após registro de fonte, evidência, teste e atualização documental. |

**Mensagem-chave:** “Dado público” não significa que qualquer cópia, transformação ou redistribuição esteja automaticamente liberada.

---

## Slide 14 — Segurança e confiança

- Perguntas públicas passam por verificação antiabuso antes da consulta.
- Telemetria é mínima e não armazena texto da pergunta ou IP como dado de análise.
- O banco de produção é acessado pelo Worker com leitura limitada às visões públicas.
- Evidências permitem identificar artefato e transformação, facilitando correção e auditoria.
- Perguntas acusatórias são bloqueadas antes de chegar aos dados.
- A publicação depende de revisão humana e não é um efeito automático do pipeline.

**Para avaliação técnica:** consultar [Operação e segurança](OPERATIONS.md), [ADRs](adr/README.md) e [trilha de auditoria](PUBLIC_AUDIT_TRAIL.md).

---

## Slide 15 — O que já foi comprovado

| Evidência | Estado |
|---|---|
| Portal e API públicos | Publicados e acessíveis. |
| Proteção antiabuso | Turnstile e rate limit ativos. |
| IA controlada | Ativa como classificador de intenções permitidas. |
| Orçamento temporal | Setembro e outubro de 2026 separados por período, filtro e checksum. |
| Qualidade técnica | 34 testes do núcleo, 24 testes do Worker, tipagem e documentação verificadas no último ciclo. |
| Documentação | Backlog, arquitetura, decisões, manual e evidências versionados no GitHub. |

Para o registro de validação, veja [validação temporal de orçamento](R0_BUDGET_TEMPORAL_COVERAGE_VALIDATION_2026-11-03.md).

---

## Slide 16 — O que ainda está em piloto ou não existe

| Tema | Situação real |
|---|---|
| Cobertura municipal completa | Não existe; há somente recortes publicados. |
| Perguntas livres sem limite | Não existe; a pergunta precisa caber no catálogo e nos dados governados. |
| Avaliação humana do piloto | Em andamento: meta de 40 perguntas reais anonimizadas. |
| Dados históricos de orçamento | Próximo trabalho: carregar e validar pelo menos 24 meses. |
| Educação e Escolas do Futuro | Fontes identificadas; ainda dependem de coleta, estruturação e evidência. |
| Diário Oficial com Document Intelligence | Pipeline em preparação; não é capacidade pública concluída. |
| Grafo, mapas, alertas externos e multi-cidade | Direção arquitetural, ainda não produto entregue. |

---

## Slide 17 — Próximas metas do projeto

| Meta | Resultado esperado |
|---|---|
| G1 — Estabilizar o piloto | 40 perguntas reais anonimizadas, critérios de qualidade e revisão semanal. |
| G2 — Série orçamentária histórica | 24 meses com períodos, filtros e política temporal comprovável. |
| G3 — Governança e release | Termos por fonte, licenças revisadas e checklist de publicação. |
| G4 — Educação e Diário Oficial | Novas fontes estruturadas com página, artefato, checksum e limites. |
| G5 — Estudo de expansão | Escolha baseada em feedback, impacto e viabilidade de fonte. |

O detalhamento, dependências e critérios de aceite estão no [handoff de metas para Rayzen](RAYZEN_GOALS_HANDOFF_2026-11-03.md).

---

## Slide 18 — Onde o apoio externo gera mais valor

### BBSIA, instituições de inovação e universidades

- avaliação da arquitetura, governança e experiência pública;
- desenho de critérios de qualidade e acessibilidade;
- apoio metodológico para testes de usuários;
- conexão com especialistas em dados abertos, LGPD e governo digital.

### Prefeitura e órgãos detentores das fontes

- confirmação documental de termos, atribuição e periodicidade;
- indicação de APIs, exportações ou canais de atualização;
- validação de campos, filtros e significado dos dados;
- definição de responsável técnico para corrigir divergências.

### Câmara, sociedade civil e imprensa

- perguntas reais para avaliação do piloto;
- indicação de fontes difíceis de encontrar;
- leitura crítica sobre clareza, linguagem e acessibilidade;
- identificação de temas de interesse público que tenham fonte verificável.

---

## Slide 19 — Pedidos objetivos de apoio

| Pedido | Para quem | Resultado esperado |
|---|---|---|
| Validar condição de uso por dataset | Prefeitura, procuradoria, controladoria, responsáveis de transparência | Registro institucional de termos, atribuição, granularidade e periodicidade. |
| Oferecer exportações/API documentadas | Equipes de tecnologia e transparência | Menos coleta manual e melhor atualização. |
| Testar o portal com casos reais | Cidadãos, Câmara, BBSIA, servidores | Conjunto N4 de perguntas, falhas e melhorias priorizadas. |
| Revisar acessibilidade e linguagem | Usuários diversos, comunicação pública, entidades de inclusão | Interface compreensível sem depender de jargão técnico. |
| Apoiar pesquisa e validação | Universidades, laboratórios, parceiros | Metodologia para qualidade, vieses, privacidade e impacto. |
| Sugerir uma fonte prioritária | Todos os públicos | Fonte oficial + pergunta que ela permite responder + contato responsável. |

**Canal de sugestões:** `marcelo.rayzen@live.com`.

---

## Slide 20 — Como sugerir uma melhoria útil

Para transformar uma ideia em backlog, peça que a pessoa informe:

1. **Qual pergunta a população deveria conseguir responder?**
2. **Qual fonte oficial sustenta essa pergunta?** Inclua URL, órgão ou documento.
3. **Qual período, unidade ou recorte importa?**
4. **Qual risco precisa ser evitado?** Ex.: interpretação indevida, dados pessoais, comparação incorreta.
5. **Quem pode confirmar o significado e a condição de uso?**

Exemplo útil: “Quero saber a evolução mensal de investimentos em uma área; a fonte é X; o campo temporal é Y; o responsável pela base é Z.”

Exemplo insuficiente: “Criem um ranking de empresas suspeitas.”

---

## Slide 21 — Perguntas para uma reunião de apoio

### Sobre dados e governança

- Quais bases são mais confiáveis e úteis para começar?
- Quem pode validar campos, filtros e periodicidade de cada base?
- Há API, CSV ou exportação estruturada que reduza coleta manual?
- Que condição de reuso deve acompanhar cada dado derivado?

### Sobre produto e impacto

- Quais perguntas as pessoas mais tentam responder hoje e não conseguem?
- Que evidência torna uma resposta confiável para seu público?
- O que é confuso, inacessível ou excessivamente técnico no portal?
- Qual recorte seria mais valioso para uma primeira demonstração institucional?

### Sobre sustentabilidade

- Quem poderia participar da avaliação semanal do piloto?
- Que parceria pode apoiar pesquisa, validação ou manutenção?
- Qual seria um critério objetivo para expandir a cobertura pública?

---

## Slide 22 — Proposta de parceria em etapas

```text
Etapa 1 — Conhecer e testar
Portal + roteiro de perguntas + feedback estruturado

Etapa 2 — Validar fonte
Termos + responsável + dicionário de dados + recorte permitido

Etapa 3 — Integrar e verificar
Artefato + checksum + normalização + testes + trilha de auditoria

Etapa 4 — Publicar com segurança
API agregada + interface + limites + documentação + monitoramento

Etapa 5 — Avaliar impacto
Uso real + erros + acessibilidade + decisão de expansão
```

Essa abordagem permite colaboração gradual: ninguém precisa entregar todos os dados ou assumir todo o risco de uma vez.

---

## Slide 23 — Chamada à ação

# Ajude a transformar transparência publicada em transparência utilizável.

Você pode contribuir de quatro formas:

1. **Teste:** faça perguntas reais e relate se a resposta foi útil, clara e conferível.
2. **Indique fontes:** apresente um portal, API, relatório ou responsável por dados oficiais.
3. **Valide:** ajude a confirmar termos, significado de campos e critérios de qualidade.
4. **Conecte:** aproxime o projeto de pessoas e instituições que possam avaliar, melhorar ou manter a iniciativa.

Contato: `marcelo.rayzen@live.com`

---

## Slide 24 — Encerramento

> Transparência útil não é apenas disponibilizar arquivos.  
> É permitir que uma pessoa faça uma pergunta, encontre a fonte, entenda o limite e confira o caminho até a resposta.

**Itapevi em Dados** já possui uma base pública funcional e auditável. O próximo passo é ampliar com responsabilidade: mais cobertura somente quando houver fonte, método, evidência, teste e decisão de governança.

---

## Apêndice A — Roteiro de demonstração de 20 minutos

| Minuto | Condução |
|---:|---|
| 0–2 | Slides 1–2: contexto e problema. |
| 2–5 | Slides 3–6: proposta, limites e públicos. |
| 5–10 | Slides 7–10: abrir o portal e demonstrar uma resposta com evidência. |
| 10–13 | Slides 11–14: arquitetura, IA e governança. |
| 13–16 | Slides 15–17: estágio comprovado, limites e metas. |
| 16–19 | Slides 18–22: pedidos de apoio e perguntas de colaboração. |
| 19–20 | Slides 23–24: chamada à ação e próximo passo combinado. |

### Preparação antes da reunião

- abrir o portal em aba anônima e conferir conexão;
- escolher uma pergunta coberta e uma pergunta fora de cobertura;
- deixar aberta a trilha de auditoria e o portal oficial correspondente;
- não exibir `.env`, banco, artefatos brutos, credenciais ou dados pendentes;
- registrar participantes, sugestões, fontes indicadas e decisões tomadas.

---

## Apêndice B — Materiais para enviar após a reunião

1. [README do projeto](../README.md).
2. [Estado atual do produto público](CURRENT_PUBLIC_PRODUCT_STATUS.md).
3. [Manual de uso](USER_MANUAL.md).
4. [Arquitetura-alvo e estado atual](architecture/architecture.md).
5. [Registro de fontes e condições de uso](DATA_SOURCES_REGISTER.md).
6. [Trilha de auditoria pública](PUBLIC_AUDIT_TRAIL.md).
7. [Handoff de metas para Rayzen](RAYZEN_GOALS_HANDOFF_2026-11-03.md).
8. [Pedido de avaliação ao BBSIA](BBSIA_REVIEW_REQUEST.md).
