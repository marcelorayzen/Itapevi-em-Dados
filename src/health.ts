import * as tools from './tools/index';

export function healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    tools: Object.values(tools).map((tool) => tool.toolDefinition.name),
  };
}
