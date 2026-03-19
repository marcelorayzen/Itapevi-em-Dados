"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const tools = __importStar(require("./tools/index"));
const server = new index_js_1.Server({
    name: 'itapevi-em-dados',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Lista todas as ferramentas
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: Object.values(tools).map((tool) => tool.toolDefinition),
    };
});
// Executa uma ferramenta específica
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = Object.values(tools).find((t) => t.toolDefinition.name === name);
    if (!tool) {
        return {
            content: [{ type: 'text', text: `Ferramenta "${name}" não encontrada.` }],
        };
    }
    try {
        return await tool.handler(args);
    }
    catch (error) {
        return {
            content: [{ type: 'text', text: `Erro ao executar ferramenta: ${error.message}` }],
        };
    }
});
const health_js_1 = require("./health.js");
Object.defineProperty(exports, "healthCheck", { enumerable: true, get: function () { return health_js_1.healthCheck; } });
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('Servidor Itapevi em Dados rodando via stdio');
}
main().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map