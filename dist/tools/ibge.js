"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDefinition = void 0;
exports.handler = handler;
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const sync_1 = require("csv-parse/sync");
const cache_1 = require("../utils/cache");
const IBGE_API = 'https://servicodados.ibge.gov.br/api/v1';
// Não precisa de parâmetros
const DadosIbgeSchema = zod_1.z.object({}).optional();
exports.toolDefinition = {
    name: 'dados_ibge',
    description: 'Retorna dados demográficos e socioeconômicos de Itapevi segundo o IBGE',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
async function handler(args) {
    try {
        DadosIbgeSchema.parse(args);
        const cacheKey = 'ibge_itapevi';
        const cached = (0, cache_1.getCached)(cacheKey);
        if (cached) {
            return { content: [{ type: 'text', text: cached }] };
        }
        const dataSource = process.env.DATA_SOURCE ?? 'ibge';
        const dataFile = 'data/itapevi-dados.csv';
        let dados = null;
        if (dataSource === 'csv') {
            try {
                const csvText = await promises_1.default.readFile(dataFile, 'utf-8');
                const parsed = (0, sync_1.parse)(csvText, { columns: true, skip_empty_lines: true });
                const item = parsed[0] ?? {};
                const populacao = Number(item.populacao ?? item.população ?? item.populacao_estimada ?? 0);
                const area = Number(item.area ?? item.extensao_territorial ?? item.area_km2 ?? 82.66);
                const pib = Number(item.pib ?? item['PIB'] ?? 0);
                dados = {
                    populacao: populacao || 0,
                    area: area || 82.66,
                    densidade: area > 0 && populacao > 0 ? Number((populacao / area).toFixed(2)) : null,
                    pib: pib || 0,
                    fonte: 'CSV (MeuMunicipio ou fonte local)',
                    data_atualizacao: new Date().toISOString().split('T')[0],
                };
            }
            catch (readError) {
                console.warn('CSV não disponível ou inválido, voltando para IBGE:', readError);
                dados = null;
            }
        }
        if (dados === null) {
            const popResp = await axios_1.default.get(`${IBGE_API}/localidades/municipios/3522505/estatisticas`);
            const pibResp = await axios_1.default.get('https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-6/variaveis/979?localidades=3522505');
            const populacao = popResp.data?.populacao_estimada ?? null;
            const area = popResp.data?.area_km2 ?? 82.66;
            const pibSerie = pibResp.data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};
            const anos = Object.keys(pibSerie).sort();
            const pibAnoMaisRecente = anos.length > 0 ? Number(pibSerie[anos[anos.length - 1]]) : 0;
            if (!populacao || isNaN(Number(populacao))) {
                throw new Error('População IBGE inválida ou não disponível.');
            }
            const densidade = area > 0 ? Number((Number(populacao) / Number(area)).toFixed(2)) : null;
            dados = {
                populacao: Number(populacao),
                area: Number(area),
                densidade,
                pib: pibAnoMaisRecente,
                fonte: 'IBGE API',
                data_atualizacao: new Date().toISOString().split('T')[0],
            };
        }
        const linhas = [
            '📊 Dados de Itapevi (IBGE):',
            `  • População estimada: ${dados.populacao.toLocaleString('pt-BR')} habitantes`,
            `  • Área territorial: ${dados.area} km²`,
            `  • Densidade demográfica: ${dados.densidade?.toLocaleString('pt-BR')} hab/km²`,
            `  • PIB estimado (último ano disponível): R$ ${dados.pib.toLocaleString('pt-BR')}`,
            `  • Fonte: ${dados.fonte} (atualizado em ${dados.data_atualizacao})`,
        ];
        const textoResposta = linhas.join('\n');
        (0, cache_1.setCache)(cacheKey, textoResposta, 60 * 60 * 24 * 30);
        return { content: [{ type: 'text', text: textoResposta }] };
    }
    catch (error) {
        console.error('Erro ao buscar dados IBGE:', error?.message ?? error);
        return {
            content: [{
                    type: 'text',
                    text: 'Não foi possível obter dados do IBGE no momento. Tente novamente mais tarde.',
                }],
        };
    }
}
//# sourceMappingURL=ibge.js.map