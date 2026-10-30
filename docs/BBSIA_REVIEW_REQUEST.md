# Pedido de avaliacao institucional ao BBSIA

## Objetivo

Solicitar ao BBSIA uma avaliacao tecnica e institucional do **Itapevi em Dados** como plataforma de inteligencia publica auditavel. O pedido nao busca transferir ao BBSIA a responsabilidade juridica de cada fonte, nem autoriza publicacao automatica de dados. Ele busca orientacao registrada para o piloto e indicacao dos responsaveis competentes quando houver necessidade de confirmacao do detentor da fonte ou de parecer juridico.

## Material a apresentar

1. [README do projeto](../README.md): proposito, estado atual e como testar localmente.
2. [Visao](vision.md), [principios](principles.md) e [arquitetura](architecture/architecture.md).
3. [Registro de fontes](DATA_SOURCES_REGISTER.md) e [revisao de termos](P0_DATA_LICENSE_REVIEW.md).
4. [Governanca de dados](DATA_GOVERNANCE.md) e [ADRs](architecture/adr/).
5. [Experiencia do portal](PRODUCT_PORTAL_EXPERIENCE.md).
6. [Manual de uso local](USER_MANUAL.md) e evidencias de validacao F1--F4.

## Perguntas para a reuniao

### Dados e licencas

- O BBSIA reconhece a separacao entre licenca do codigo e termos/licencas de dados como condicao adequada para o piloto?
- Ha uma area ou profissional que possa registrar revisao institucional dos termos de cada fonte?
- Para cada dataset, quem deve confirmar atribuicao, condicao de redistribuicao, campos permitidos e periodicidade?
- Quais fontes podem ser usadas apenas para leitura local, quais admitem agregados em demo e quais podem ser publicadas?
- Qual formato de registro e aceitavel: termo da fonte, URL arquivada, data de consulta, responsavel e decisao?

### Demonstracao e seguranca

- A primeira demonstracao aberta deve conter somente dados sinteticos ou ha algum dataset agregado ja aprovado?
- O BBSIA prefere inicialmente uma pagina estatica no GitHub Pages ou uma previa privada autenticada?
- Quem serao os avaliadores, por quanto tempo e com qual canal para relatar problemas?
- Quais requisitos minimos de acessibilidade, identidade visual, hospedagem, logs e suporte devem constar da demonstracao?
- Que criterio objetivo declara a demonstracao apta para ser apresentada a prefeituras e camaras?

### Governanca e metodo

- O modelo de evidencia (fonte, artefato, checksum, pagina/secao, periodo e transformacao) atende ao nivel esperado de auditabilidade?
- A linguagem nao acusatoria e os bloqueios do ADR-011 atendem ao protocolo de comunicacao publica esperado?
- Que revisao humana deve existir antes de promover um indicador a conteudo publico?

## Saidas esperadas

Ao final, registrar em ata ou e-mail:

| Item | Registro esperado |
|---|---|
| Participantes e papeis | Nome, area e responsabilidade |
| Fontes avaliadas | Dataset, origem, termo localizado e condicao de uso |
| Decisao de demonstracao | Estatica publica, previa privada ou ambas |
| Dados permitidos | Campos, granularidade, periodo e atribuicao |
| Pendencias | Responsavel, proximo passo e prazo |
| Criterio de aprovacao | Quem aprova e qual evidencia sera arquivada |

## Limite juridico

A avaliacao tecnica/institucional do BBSIA e valiosa para governanca, mas nao substitui autorizacao do detentor da fonte, termo expresso ou parecer juridico quando houver duvida sobre direitos, LGPD, redistribuicao, dados pessoais ou responsabilidade editorial. Enquanto a condicao nao for confirmada, o dataset permanece pendente de revisao e nao integra uma demonstracao publica.

