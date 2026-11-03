# Plano - Perguntas livres com respostas verificáveis

## Objetivo

Permitir pergunta em linguagem natural sem transformar texto livre em acesso livre ao banco. Cada resposta deve resultar de uma intenção permitida, parâmetros validados, dados reais, evidência e limites explícitos.

## Etapa A - Base e segurança

- [x] Remover conteúdo ilustrativo da experiência renderizada e alinhar o portal ao catálogo público atual; o HTML histórico permanece como material técnico, mas não é apresentado ao usuário.
- [ ] Formalizar catálogo de capacidades públicas: população, contratos, licitações e execução orçamentária.
- [ ] Versionar visões públicas, testes de permissão e teste de reconciliação por artefato.
- [ ] Registrar decisões de termos e publicação por dataset.

**Autorização necessária:** alterações locais, migrations, testes, commits e push. Não requer novo deploy até a revisão da etapa.

## Etapa B - Entendimento de pergunta livre

- [ ] Definir contrato `Intent`: tema, entidade, período, medida, filtros e confiança.
- [ ] Implementar extrator determinístico de período: mês, ano, "este mês", "este ano" e intervalos explícitos.
- [ ] Criar dicionário governado de medidas: previsto, empenhado, liquidado, pago e contratado.
- [ ] Criar dicionário de entidades: secretarias, programas, ações e unidades de saúde.
- [ ] Retornar pedido de esclarecimento quando houver ambiguidade, em vez de supor entidade ou período.

**Autorização necessária:** alterações locais, uso dos dados já aprovados, migrations, testes, commits e push. Sem uso de IA generativa nesta etapa.

## Etapa C - Cobertura real de saúde e unidades

- [ ] Descobrir e registrar fontes oficiais de despesas detalhadas de saúde.
- [ ] Baixar/exportar somente dados públicos autorizados, preservando arquivo local, checksum e filtros.
- [ ] Normalizar fatos por órgão, programa, ação, unidade, credor quando aplicável e mês.
- [ ] Mapear `Pronto-Socorro`, `PS`, `urgência` e nomes oficiais como aliases revisáveis.
- [ ] Reconciliar totais com o portal e documentar lacunas.

**Autorização necessária:** coleta automatizada/semiautomatizada em portais públicos e uso de Downloads locais; nenhuma publicação até validação de qualidade.

## Etapa D - Consultas públicas reais

- [ ] Criar visões agregadas restritas por capacidade aprovada.
- [ ] Implementar respostas para gasto por unidade, período, órgão, programa e modalidade.
- [ ] Exibir fonte, filtro, período, checksum, cálculo, cobertura e limites por resposta.
- [ ] Expandir página de evidência e adicionar feedback/correção.

**Autorização necessária:** migrations, deploy do Worker e publicação do portal após testes e revisão humana.

## Etapa E - IA como intérprete controlado

- [ ] Avaliar modelo gratuito ou de baixo custo para converter pergunta em `Intent` estruturado.
- [ ] Validar JSON, permitir somente intents e filtros permitidos e bloquear acesso SQL livre.
- [ ] Avaliar prompts adversariais, ambiguidade e recusas.
- [ ] Usar o modelo apenas quando o roteador determinístico não resolver a pergunta.

**Autorização necessária:** escolha explícita de provedor/modelo, criação de chave e envio de perguntas ao provedor. Login do Codex/ChatGPT não deve ser usado como credencial do produto.

## Etapa F - Piloto e operação

- [ ] Bateria de perguntas reais de cidadãos, vereadores, prefeitura e BBSIA.
- [ ] Monitoramento mínimo, revisão semanal Marcelo/Rayzen e fila de lacunas solicitadas.
- [ ] Rotina de atualização, reprocessamento, retenção de artefatos e rotação de credenciais.
- [ ] Checklist de demonstração institucional e relatório de limitações.

**Autorização necessária:** deploy público, eventual custo recorrente e qualquer integração externa adicional.

## Critério de produto funcional

Uma pergunta livre só recebe número quando tema, entidade, período e medida forem cobertos por fato aprovado. Nos demais casos, o portal explica a lacuna e registra a demanda sem inventar dados.
