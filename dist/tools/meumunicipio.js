"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDefinition = void 0;
exports.handler = handler;
const zod_1 = require("zod");
const scraping_1 = require("../utils/scraping");
const cache_1 = require("../utils/cache");
exports.toolDefinition = {
    name: 'dados_meumunicipio',
    description: 'Dados comparativos de Itapevi baseados no Censo 2010 via MeuMunicipio.org.br',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const DadosMeuMunicipioSchema = zod_1.z.object({}).optional();
async function handler(args) {
    try {
        DadosMeuMunicipioSchema.parse(args);
        const cacheKey = 'meumunicipio_itapevi';
        const cached = (0, cache_1.getCached)(cacheKey);
        if (cached) {
            return { content: [{ type: 'text', text: cached }] };
        }
        const url = 'https://meumunicipio.org.br/perfil-municipio/3522505-Itapevi-SP';
        const html = await (0, scraping_1.fetchHTML)(url);
        const $ = (0, scraping_1.parseHTML)(html);
        const campo = (label) => {
            const node = $(`td:contains("${label}")`).first();
            return node.length ? node.next().text().trim() : 'não disponível';
        };
        const populacao = campo('POPULAÇÃO');
        const densidade = campo('DENSIDADE DEMOGRÁFICA');
        const area = campo('EXTENSÃO TERRITORIAL');
        const pib = campo('PIB');
        const pibPerCapita = campo('PIB per capita');
        const respostas = [
            '📋 Dados de Itapevi (MeuMunicipio.org.br - Censo 2010):',
            `  • População: ${populacao}`,
            `  • Densidade demográfica: ${densidade}`,
            `  • Extensão territorial: ${area}`,
            `  • PIB: ${pib}`,
            `  • PIB per capita: ${pibPerCapita}`,
            '  • Fonte: MeuMunicipio.org.br (Censo 2010)',
        ].join('\n');
        (0, cache_1.setCache)(cacheKey, respostas, 60 * 60 * 24 * 30);
        return { content: [{ type: 'text', text: respostas }] };
    }
    catch (error) {
        console.error('Erro ao buscar dados MeuMunicipio:', error?.message ?? error);
        return {
            content: [{ type: 'text', text: 'Dados do MeuMunicipio temporariamente indisponíveis.' }],
        };
    }
}
//# sourceMappingURL=meumunicipio.js.map