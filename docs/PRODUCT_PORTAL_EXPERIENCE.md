# Portal de apresentacao e teste

## Decisao de produto

O endereco `/demo` existente e um **console tecnico local**. Ele e adequado para conferir ingestao, catalogo, cobertura, evidencias e respostas guiadas. Ele nao representa a interface que cidadaos, equipes municipais, vereadores ou avaliadores do BBSIA usarao.

O portal de apresentacao sera uma entrega separada. Seu objetivo e explicar o valor da plataforma, permitir exploracao segura de informacoes e mostrar a cadeia de evidencia sem expor dados, documentos ou conclusoes que ainda nao foram autorizados.

## Publicos e necessidades

| Publico | Pergunta principal | Resposta esperada do portal |
|---|---|---|
| Cidadao | O que esta acontecendo com um tema da cidade? | Indicador simples, periodo, fonte e explicacao do limite |
| Vereador ou assessor | Onde encontro um recorte verificavel para fiscalizacao? | Filtros, comparacoes, fontes, cobertura e evidencia navegavel |
| Prefeitura | Como esta solucao organiza transparencia sem perder controle? | Fluxo de dados, governanca, seguranca e demonstracao controlada |
| BBSIA | O projeto e auditavel, reutilizavel e responsavel? | Arquitetura, testes, licencas, rastreabilidade e roteiro de avaliacao |
| Equipe tecnica | Como reproduzo um resultado? | Dataset, artefato, checksum, data de coleta, transformacao e testes |

## Experiencia inicial proposta

A primeira versao deve privilegiar clareza e confianca, nao um chat generico. A navegacao proposta e:

1. **Inicio:** proposta de valor, aviso de demonstracao e acesso aos temas.
2. **Explorar dados:** cartoes de temas como populacao, orcamento e compras, cada um com periodo e cobertura.
3. **Entender o orcamento:** previsto x realizado por orgao/programa, criterios e periodo claramente visiveis.
4. **Compras e licitacoes:** totais por modalidade, sem inferir conduta ou exibir detalhes nao autorizados.
5. **Perguntas guiadas:** perguntas sugeridas que usam consultas verificaveis; linguagem natural livre pode vir depois, com citacoes obrigatorias.
6. **Evidencias:** painel lateral com fonte, dataset, artefato, checksum, pagina/secao, coleta, confianca e limitacoes.
7. **Metodo e fontes:** como os dados entram, quais termos estao pendentes e como reportar correcao.

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

## Ambientes de demonstracao

| Ambiente | Publico | Conteudo | Estado |
|---|---|---|---|
| Local tecnico | Equipe do projeto | Dados locais controlados, console e testes | Disponivel |
| Demo estatica publica | BBSIA e apresentacoes abertas | Dados sinteticos ou fontes liberadas; sem backend | Implementada; publicacao no Pages pendente de ativacao administrativa |
| Previa privada | Convidados identificados | Apenas datasets liberados e agregados aprovados | Preparada tecnicamente, desligada |
| Portal publico | Populacao | Dados e funcoes aprovados para publicacao | Futuro |

### GitHub Pages

Pode hospedar uma demonstracao estatica, visual e interativa com dados sinteticos claramente identificados. E a melhor primeira opcao para avaliacao publica, porque o codigo e a pagina podem ser revisados sem publicar banco, credenciais ou fontes sob revisao.

Nao deve hospedar:

- `.env`, chaves ou URL de banco;
- API privada ou PostgreSQL;
- artefatos brutos locais;
- dados com termos `pending_review`;
- informacoes pessoais ou contratuais fora de uma liberacao especifica.

### Subdominio de testes

Um subdominio e apropriado para uma previa controlada que consuma a API privada ja preparada. Antes de publicar, sao obrigatorios:

- decisao de provedor e responsavel operacional;
- dominio/subdominio definido e controle de DNS;
- datasets, campos e condicoes de redistribuicao aprovados;
- allowlist de origens, chaves individuais, limite de requisicoes e logs;
- HTTPS, monitoramento, plano de revogacao e contato de suporte;
- revisao humana por ApprovalGate.

## Roteiro de demonstracao de 10 minutos

1. **Problema (1 min):** dados municipais existem, mas sao dificeis de localizar, entender e conferir.
2. **Pergunta pratica (2 min):** abrir “previsto x realizado” e escolher orgao/programa.
3. **Leitura responsavel (2 min):** mostrar periodo, cobertura e o que o numero nao prova.
4. **Evidencia (2 min):** abrir fonte, artefato/checksum e criterio de transformacao.
5. **Governanca (2 min):** mostrar termos, proveniencia, ADR-011 e bloqueios de publicacao.
6. **Proximo passo (1 min):** explicar piloto, validacao institucional e como o publico podera testar.

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

## Decisoes que exigem aprovacao de Marcelo

Antes de implementar ou publicar a interface, precisam ser escolhidos:

1. se a primeira demo sera somente sintetica, dados locais em reuniao ou ambas;
2. se o primeiro destino sera GitHub Pages, subdominio privado ou os dois em etapas;
3. qual dominio/subdominio e provedor serao usados, caso haja previa privada;
4. quais pessoas/grupos poderao testar e quem responde pelo suporte;
5. quais datasets/campos receberam liberacao documentada.

Enquanto essas decisoes nao existirem, a equipe pode evoluir wireframes, testes locais, conteudo institucional e documentacao, mas nao deve publicar dados reais. A configuracao operacional do segundo ambiente esta em [Previa privada em subdominio](PRIVATE_PREVIEW_DEPLOYMENT.md).

