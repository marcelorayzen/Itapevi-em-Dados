# Pedido de avaliacao institucional ao BBSIA

## Objetivo

Solicitar ao BBSIA uma avaliacao tecnica e institucional do **Itapevi em Dados** como plataforma de inteligencia publica auditavel. O pedido nao busca transferir ao BBSIA a responsabilidade juridica de cada fonte, nem autoriza publicacao automatica de dados. Ele busca orientacao registrada para o piloto e indicacao dos responsaveis competentes quando houver necessidade de confirmacao do detentor da fonte ou de parecer juridico.

## Material a apresentar

1. [README do projeto](../README.md), [estado público](CURRENT_PUBLIC_PRODUCT_STATUS.md) e [manual](USER_MANUAL.md): propósito, estado atual e como testar o portal.
2. [Visao](vision.md), [principios](principles.md) e [arquitetura](architecture/architecture.md).
3. [Registro de fontes](DATA_SOURCES_REGISTER.md).
4. [Governança de dados](DATA_GOVERNANCE.md) e [ADRs canônicos](adr/README.md).
5. [Trilha de auditoria pública](PUBLIC_AUDIT_TRAIL.md) e [API pública](F3_PUBLIC_API_WORKER.md).

## Perguntas para a reuniao

### Dados e licencas

- O BBSIA reconhece a separacao entre licenca do codigo e termos/licencas de dados como condicao adequada para o piloto?
- Ha uma area ou profissional que possa registrar revisao institucional dos termos de cada fonte?
- Para cada dataset, quem deve confirmar atribuicao, condicao de redistribuicao, campos permitidos e periodicidade?
- Quais fontes podem ser usadas apenas para leitura local, quais admitem agregados em demo e quais podem ser publicadas?
- Qual formato de registro e aceitavel: termo da fonte, URL arquivada, data de consulta, responsavel e decisao?

### Demonstracao e seguranca

- A cobertura pública de agregados municipais e IBGE, com fonte, período e checksum, atende à expectativa de auditabilidade do piloto?
- O BBSIA recomenda algum controle adicional antes de ampliar a cobertura pública para novos datasets municipais?
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
| Decisão de demonstração | Manter portal público, ampliar cobertura ou criar prévia autenticada complementar |
| Dados permitidos | Campos, granularidade, periodo e atribuicao |
| Pendencias | Responsavel, proximo passo e prazo |
| Criterio de aprovacao | Quem aprova e qual evidencia sera arquivada |

## Limite juridico

A avaliação técnica/institucional do BBSIA é valiosa para governança, mas não substitui autorização do detentor da fonte, termo expresso ou parecer jurídico quando houver dúvida sobre direitos, LGPD, redistribuição, dados pessoais ou responsabilidade editorial. Enquanto a condição não for confirmada, **um novo dataset ou campo** permanece pendente de revisão e não integra a cobertura pública.

