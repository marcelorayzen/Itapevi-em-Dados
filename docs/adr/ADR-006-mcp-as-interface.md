# ADR-006 — MCP como interface

- **Status:** Aceito
- **Contexto:** o protótipo é MCP, mas a plataforma poderá ter outras formas de entrega.
- **Decisão:** manter MCP como adaptador de interface, sem acoplar regras de domínio a um cliente ou modelo.
- **Consequências:** o mesmo núcleo atende MCP, portal e API; novas interfaces não devem duplicar regras de domínio.
- **Alternativas consideradas:** fazer MCP o núcleo do produto; rejeitada por limitar reuso.
