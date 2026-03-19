"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDefinition = void 0;
exports.handler = handler;
const zod_1 = require("zod");
const BuscarDespesasSchema = zod_1.z.object({
    ano: zod_1.z.number().int().min(2000).max(2030),
    mes: zod_1.z.number().int().min(1).max(12).optional(),
});
exports.toolDefinition = {
    name: 'buscar_despesas',
    description: 'Consulta despesas da Prefeitura de Itapevi por ano e mês (opcional)',
    inputSchema: {
        type: 'object',
        properties: {
            ano: { type: 'number', description: 'Ano (ex: 2025)' },
            mes: { type: 'number', description: 'Mês (1 a 12) - opcional' },
        },
        required: ['ano'],
    },
};
async function handler(args) {
    try {
        const params = BuscarDespesasSchema.parse(args);
        // Mock de dados
        const despesasMock = {
            2025: {
                total: 12500000,
                porOrgao: {
                    Saúde: 4500000,
                    Educação: 3800000,
                    Segurança: 1200000,
                    Infraestrutura: 2000000,
                    Administração: 1000000,
                },
            },
        };
        const dadosAno = despesasMock[params.ano];
        if (!dadosAno) {
            return { content: [{ type: 'text', text: `Dados para o ano ${params.ano} não disponíveis.` }] };
        }
        let resposta = `Despesas de ${params.ano}`;
        if (params.mes)
            resposta += ` - mês ${params.mes}`;
        resposta += ':\n';
        resposta += `Total: R$ ${dadosAno.total.toLocaleString('pt-BR')}\n`;
        resposta += 'Por órgão:\n';
        for (const [orgao, valor] of Object.entries(dadosAno.porOrgao)) {
            resposta += `  • ${orgao}: R$ ${valor.toLocaleString('pt-BR')}\n`;
        }
        return { content: [{ type: 'text', text: resposta }] };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return { content: [{ type: 'text', text: `Erro de validação: ${error.message}` }] };
        }
        throw error;
    }
}
//# sourceMappingURL=transparencia.js.map