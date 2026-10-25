# ADR-008 — MCP como interface, não núcleo

- **Status:** Proposta
- **Contexto:** a V1 é MCP, mas portal e API também são produtos da V2.
- **Decisão:** expor os mesmos casos de uso por adaptadores de entrega; regras de negócio, autorização e proveniência vivem no núcleo.
- **Consequência:** clientes MCP continuam suportados sem impedir API HTTP, dashboards ou portal web.
