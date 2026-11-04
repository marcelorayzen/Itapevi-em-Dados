# Status técnico do protótipo local

> **Leitura correta:** este inventário inclui componentes locais e legados. O portal e a API públicos já existem; para eles, consulte [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md).

| Componente | Estado | Limites conhecidos |
|---|---|---|
| Servidor MCP | Implementado | Servidor TypeScript/Node.js de ferramentas via `stdio`. |
| Cache e validação de entradas | Implementado | Cobertura e comportamento variam por ferramenta. |
| Health-check e testes iniciais | Implementado | Não comprovam qualidade/atualidade das fontes em produção. |
| Diagnóstico local no navegador | Implementado | Disponível em `http://localhost:3000/`; confirma inicialização e não é o portal público. |
| IBGE | Integração existente | Depende da disponibilidade e do contrato externo. |
| Diário Oficial e MeuMunicípio | Experimental | Scraping sujeito a alteração de portal, HTML e seletor. |
| Despesas, legislação, licitações e demandas | Mock ou placeholder | Não devem ser tratadas como dados públicos consolidados. |
| Grafo, timeline e multi-cidade | Planejado V2 | Não são capacidades públicas atuais. |
| Provenance, lineage, trust e alertas avançados | Parcial/planejado | Proveniência e evidência existem nos recortes publicados; os engines completos continuam planejados. |
| Portal web e API pública | Publicados | Portal no GitHub Pages e Worker/Hyperdrive com leituras agregadas e controles de acesso. |

Qualquer resposta do protótipo local ou do portal público deve ser conferida na fonte oficial aplicável. No portal, use a trilha de auditoria para abrir a origem e o método de conferência.
