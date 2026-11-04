# Portal público: experiência e avaliação

> **Estado vigente em 03/11/2026:** o portal está publicado em [itapevi-em-dados.rayzen.com.br](https://itapevi-em-dados.rayzen.com.br), sem login e com consultas restritas à cobertura oficial carregada. Este documento foi conciliado para preservar a proposta original e registrar a experiência já entregue. Para o escopo verificável, prevalecem [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md) e [CAPABILITIES.md](CAPABILITIES.md).

## Decisão de produto atual

O endereço `/demo` é um **console técnico local**. Ele continua adequado para conferir ingestão, catálogo, cobertura, evidências e respostas guiadas, mas não representa a interface pública que cidadãos, equipes municipais, vereadores ou avaliadores do BBSIA usam.

O portal de apresentação foi entregue como uma interface pública separada. Seu objetivo é explicar o valor da plataforma, permitir exploração segura e mostrar a cadeia de evidência sem expor dados brutos, documentos locais ou conclusões não sustentadas.

## Publicos e necessidades

| Publico | Pergunta principal | Resposta esperada do portal |
|---|---|---|
| Cidadao | O que esta acontecendo com um tema da cidade? | Indicador simples, periodo, fonte e explicacao do limite |
| Vereador ou assessor | Onde encontro um recorte verificavel para fiscalizacao? | Filtros, comparacoes, fontes, cobertura e evidencia navegavel |
| Prefeitura | Como esta solucao organiza transparencia sem perder controle? | Fluxo de dados, governanca, seguranca e demonstracao controlada |
| BBSIA | O projeto e auditavel, reutilizavel e responsavel? | Arquitetura, testes, licencas, rastreabilidade e roteiro de avaliacao |
| Equipe tecnica | Como reproduzo um resultado? | Dataset, artefato, checksum, data de coleta, transformacao e testes |

## Experiência publicada

A versão pública privilegia clareza e confiança, não um chat que improvise fatos. A navegação disponível é:

1. **Início:** proposta de valor, contexto e acesso às perguntas sugeridas ou livres dentro da cobertura.
2. **Consulta:** população, orçamento, contratos, licitações e urgência/emergência apenas quando houver recorte publicado.
3. **Resposta:** conclusão descritiva, período, cobertura e limite visível.
4. **Evidências:** fonte oficial, identificador de origem, dataset, checksum e botão **Ver trilha de auditoria**.
5. **Método e fontes:** documentação da coleta, condição de uso, limitações e canal de correção/feedback.

Cada resultado precisa exibir, no minimo:

- periodo e recorte aplicado;
- fonte e data de coleta;
- cobertura do dado e limitacoes;
- status dos termos de uso;
- link ou identificador da evidencia;
- linguagem descritiva, sem imputacao de culpa.

## O que nao entra na primeira versao

- acusacoes, rankings de conduta ou conclusoes juridicas;
- documentos brutos ou registros individuais sem liberacao explicita;
- login de cidadaos ou coleta de dados pessoais;
- respostas geradas por IA sem fonte e criterio reproduzivel;
- exposicao externa do banco PostgreSQL local.

## Ambientes

| Ambiente | Publico | Conteudo | Estado |
|---|---|---|---|
| Local técnico | Equipe do projeto | Dados locais controlados, console e testes | Disponível |
| Portal público | Público | Recortes reais agregados, evidências e API pública restrita | Publicado |
| Prévia privada | Convidados identificados | Alternativa histórica com chave individual | Preparada tecnicamente, não ativada |

### GitHub Pages

Hospeda o portal estático e a experiência de consulta que chama a API pública restrita. O código e a página podem ser revisados sem publicar banco, credenciais, arquivos brutos ou fontes fora da cobertura.

Nao deve hospedar:

- `.env`, chaves ou URL de banco;
- API privada ou PostgreSQL;
- artefatos brutos locais;
- dados com termos `pending_review`;
- informacoes pessoais ou contratuais fora de uma liberacao especifica.

### Subdomínio e API pública

O subdomínio público foi definido como `itapevi-em-dados.rayzen.com.br`; a API técnica fica em `api-dados.rayzen.com.br`. Antes de ampliar cobertura ou publicar novo dataset, são obrigatórios:

- responsável operacional e revisão humana;
- dataset, campos, período e condição de uso registrados;
- testes de origem, cobertura, recusa e evidência;
- HTTPS, controle antiabuso, monitoramento proporcional e plano de reversão;
- atualização do estado público, capacidades, fontes, backlog e manual.

## Roteiro de demonstracao de 10 minutos

1. **Problema (1 min):** dados municipais existem, mas sao dificeis de localizar, entender e conferir.
2. **Pergunta pratica (2 min):** abrir “previsto x realizado” e escolher orgao/programa.
3. **Leitura responsavel (2 min):** mostrar periodo, cobertura e o que o numero nao prova.
4. **Evidencia (2 min):** abrir fonte, artefato/checksum e criterio de transformacao.
5. **Governanca (2 min):** mostrar termos, proveniencia, ADR-011 e bloqueios de publicacao.
6. **Próximo passo (1 min):** explicar cobertura atual, avaliação N4 e como enviar feedback.

## Plano de testes da interface

| Teste | Participante | Criterio de aceite |
|---|---|---|
| Encontrar indicador | Cidadao | Localiza um tema e entende periodo/fonte sem apoio |
| Conferir evidencia | Vereador/assessor | Chega a fonte e entende cobertura/limite |
| Avaliar governanca | BBSIA/prefeitura | Identifica termos, trilha de dados e controles de publicacao |
| Pergunta guiada | Todos | Recebe resposta com fonte, periodo e linguagem nao acusatoria |
| Acessibilidade basica | Todos | Navega por teclado, le textos e entende avisos sem depender de cor |
| Seguranca de conteudo | Equipe | Nenhum dado pendente, segredo ou documento bruto entra na demo publica |

Registre participantes, data, versao, roteiro usado, resultado e correcoes no diario antes de declarar a interface apta para apresentacao externa.

## Decisões que exigem aprovação de Marcelo

Antes de ampliar o produto além da cobertura atual, precisam ser escolhidos:

1. se e quando ativar a interpretação pública por IA após N4;
2. quais fontes, campos, períodos e agregações entram no próximo recorte;
3. como tratar feedback e suporte durante o piloto público;
4. se haverá prévia autenticada separada do portal público;
5. quais datasets/campos receberam liberação documentada para nova publicação.

Enquanto essas decisões não existirem, a equipe pode evoluir testes, conteúdo institucional, documentação e coleta local, mas não deve ampliar a cobertura pública. A configuração da alternativa não ativada está em [Prévia privada em subdomínio](PRIVATE_PREVIEW_DEPLOYMENT.md).

