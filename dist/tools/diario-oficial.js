"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDefinition = void 0;
exports.handler = handler;
const zod_1 = require("zod");
const scraping_1 = require("../utils/scraping");
const cache_1 = require("../utils/cache");
const BuscarPublicacoesSchema = zod_1.z.object({
    palavra_chave: zod_1.z.string().optional(),
    limite: zod_1.z.number().min(1).max(50).optional(),
});
exports.toolDefinition = {
    name: 'buscar_publicacoes_oficiais',
    description: 'Busca publicações no Diário Oficial de Itapevi (Gazeta SP/Legal).',
    inputSchema: {
        type: 'object',
        properties: {
            palavra_chave: { type: 'string', description: 'Palavra-chave para busca' },
            limite: { type: 'number', description: 'Número máximo de resultados (1-50)' },
        },
    },
};
async function handler(args) {
    try {
        const params = BuscarPublicacoesSchema.parse(args);
        const limite = params.limite ?? 10;
        const cacheKey = `diario_${params.palavra_chave || 'todas'}_${limite}`;
        const cached = (0, cache_1.getCached)(cacheKey);
        if (cached)
            return { content: [{ type: 'text', text: cached }] };
        const html = await (0, scraping_1.fetchHTML)('https://www.gazetasp.com.br/publicidade-legal/itapevi');
        const $ = (0, scraping_1.parseHTML)(html);
        const publicacoes = [];
        $('.box-publicidade').each((i, elem) => {
            if (publicacoes.length >= limite)
                return false;
            const titulo = $(elem).find('h4').text().trim();
            const data = $(elem).find('.date').text().trim() || 'data não encontrada';
            let link = $(elem).find('a').attr('href') || '';
            if (link && !link.startsWith('http')) {
                link = `https://www.gazetasp.com.br${link}`;
            }
            if (params.palavra_chave && !titulo.toLowerCase().includes(params.palavra_chave.toLowerCase())) {
                return;
            }
            publicacoes.push({ titulo, data, link });
        });
        if (publicacoes.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: `Nenhuma publicação encontrada${params.palavra_chave ? ` com '${params.palavra_chave}'` : ''}.`,
                    }],
            };
        }
        const linhas = ['📰 Últimas publicações do Diário Oficial de Itapevi:'];
        publicacoes.forEach((pub, idx) => {
            linhas.push(`${idx + 1}. ${pub.data} - ${pub.titulo}`);
            if (pub.link)
                linhas.push(`   🔗 ${pub.link}`);
        });
        const resposta = linhas.join('\n');
        (0, cache_1.setCache)(cacheKey, resposta, 60 * 60 * 6); // 6 horas
        return { content: [{ type: 'text', text: resposta }] };
    }
    catch (error) {
        console.error('Erro ao buscar diário oficial:', error?.message ?? error);
        return { content: [{ type: 'text', text: 'Não foi possível acessar o Diário Oficial no momento.' }] };
    }
}
//# sourceMappingURL=diario-oficial.js.map