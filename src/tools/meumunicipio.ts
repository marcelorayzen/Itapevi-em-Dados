import { z } from 'zod';
import { fetchHTML, parseHTML } from '../utils/scraping';
import { getCached, setCache } from '../utils/cache';

export const toolDefinition = {
  name: 'dados_meumunicipio',
  description: 'Dados comparativos de Itapevi baseados no Censo 2010 via MeuMunicipio.org.br',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

const DadosMeuMunicipioSchema = z.object({}).optional();

export async function handler(args: unknown) {
  try {
    DadosMeuMunicipioSchema.parse(args);

    const cacheKey = 'meumunicipio_itapevi';
    const cached = getCached(cacheKey);
    if (cached) {
      return { content: [{ type: 'text', text: cached }] };
    }

    const url = 'https://meumunicipio.org.br/perfil-municipio/3522505-Itapevi-SP';
    const html = await fetchHTML(url);
    const $ = parseHTML(html);

    const campo = (label: string) => {
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

    setCache(cacheKey, respostas, 60 * 60 * 24 * 30);
    return { content: [{ type: 'text', text: respostas }] };
  } catch (error: any) {
    console.error('Erro ao buscar dados MeuMunicipio:', error?.message ?? error);
    return {
      content: [{ type: 'text', text: 'Dados do MeuMunicipio temporariamente indisponíveis.' }],
    };
  }
}
