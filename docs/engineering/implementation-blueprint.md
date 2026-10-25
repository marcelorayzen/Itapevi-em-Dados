# Blueprint de implementação

## Primeiro incremento

Implementar o fluxo vertical **Diário Oficial -> artefato bruto -> normalização -> evento/entidade candidata -> revisão -> PostgreSQL -> resposta MCP com citação**. Só então projetar para Neo4j.

Ele valida origem, idempotência, versionamento e apresentação de evidências antes de introduzir grafo amplo ou agentes autônomos.

## Backlog técnico

1. PostgreSQL, migrações e modelo tenant/município/dataset/fonte/artefato/execução.
2. Armazenamento de artefatos e checksums.
3. Contrato comum de conector V1 e executor de coleta.
4. Eventos, fatos, evidências e revisões.
5. API de leitura de proveniência e testes de isolamento.
6. Prova de conceito Docling com conjunto real de PDFs.
7. Projeção Neo4j apenas para dados aceitos e consultas de caminho limitadas.

## Critérios transversais

- Nenhuma perda de artefato bruto; migrações reversíveis quando possível.
- Testes de contrato de conectores e reprocessamento idempotente.
- Logs por `run_id`, métricas de atraso/falha/cobertura e alertas operacionais.
- Secrets apenas em ambiente gerenciado; nunca em `.env` versionado.
