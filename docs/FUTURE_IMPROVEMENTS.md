# Melhorias futuras registradas

Este catálogo preserva ideias aprovadas para exploração futura. Nenhum item abaixo deve ser apresentado como funcionalidade atual sem código, teste e evidência operacional.

## Dados e qualidade

- Criar amostras manuais de referência para medir fidelidade de tabelas Docling por tipo documental.
- Ajustar pipeline de OCR por documento/página, em vez de habilitá-lo globalmente.
- Armazenar métricas de cobertura, células descartadas e qualidade por execução.
- Adicionar validações de soma, formato e coerência entre total, subtotais e período.

## Entidades e conhecimento

- Empresas: usar CNPJ como chave forte quando disponível; manter razão social, nome fantasia e aliases separados.
- Pessoas públicas: modelar cargo, órgão e vigência temporal, apenas quando a fonte oficial justificar; evitar coleta além do divulgado oficialmente.
- Legislação, contratos e licitações: conectar somente por identificadores/evidências verificáveis.
- Geografia: bairros, distritos, CEPs e equipamentos públicos, com fonte geográfica e precisão declaradas.
- Grafo: avaliar apenas após uma pergunta relacional não atendida por PostgreSQL; projeção sempre reconstruível.

## Proveniência e governança

- Completar validação de termos, licença e redistribuição por fonte antes de qualquer publicação de derivados.
- Definir retenção, backup, criptografia, credenciais e recuperação para ambiente não local.
- Registrar revisão humana e justificativa em fusões de entidade e em dados de baixa confiança.
- Gerar SBOM e manter revisão de licenças quando o lockfile mudar.

## Produto e inteligência responsável

- Catálogo navegável de datasets com cobertura, atualização, termos e limitações.
- Contrato único para MCP e interfaces futuras, incluindo evidências e nível de confiança.
- Insights somente descritivos, reproduzíveis e não acusatórios, conforme ADR-011.
- Alertas internos primeiro; entrega automática somente após critérios de ruído, destinatário e revisão humana.

## Próxima revisão

Revisar este catálogo semanalmente com o backlog. Todo item escolhido deve receber identificador, critério de aceite, fonte de evidência e responsável antes de implementação.
