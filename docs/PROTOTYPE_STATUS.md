# Status do Protótipo

| Componente | Estado | Limites conhecidos |
|---|---|---|
| Servidor MCP | Implementado | Servidor TypeScript/Node.js de ferramentas via `stdio`. |
| Cache e validação de entradas | Implementado | Cobertura e comportamento variam por ferramenta. |
| Health-check e testes iniciais | Implementado | Não comprovam qualidade/atualidade das fontes em produção. |
| Diagnóstico local no navegador | Implementado | Disponível somente em `http://localhost:3000/`; confirma inicialização e não é portal de consultas. |
| IBGE | Integração existente | Depende da disponibilidade e do contrato externo. |
| Diário Oficial e MeuMunicípio | Experimental | Scraping sujeito a alteração de portal, HTML e seletor. |
| Despesas, legislação, licitações e demandas | Mock ou placeholder | Não devem ser tratadas como dados públicos consolidados. |
| Grafo, memória histórica, timeline | Planejado V2 | Não implementados. |
| Provenance Engine, lineage, trust e alertas | Planejado V2 | Não implementados. |
| Portal web e API pública | Planejado V2 | Não implementados. |

Qualquer resposta do protótipo deve ser conferida na fonte oficial aplicável.
