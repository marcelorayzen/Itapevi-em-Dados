import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as tools from './tools/index';

const server = new Server(
  {
    name: 'itapevi-em-dados',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Lista todas as ferramentas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.values(tools).map((tool) => tool.toolDefinition),
  };
});

// Executa uma ferramenta específica
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const tool = Object.values(tools).find((t) => t.toolDefinition.name === name);
  if (!tool) {
    return {
      content: [{ type: 'text', text: `Ferramenta "${name}" não encontrada.` }],
    };
  }

  try {
    return await tool.handler(args);
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Erro ao executar ferramenta: ${error.message}` }],
    };
  }
});

import { healthCheck } from './health.js';

export { healthCheck };

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Servidor Itapevi em Dados rodando via stdio');
}

main().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
