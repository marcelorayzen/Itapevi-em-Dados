import axios from 'axios';
import { z } from 'zod';
import { getCached, setCache } from '../utils/cache';

const IBGE_API = 'https://servicodados.ibge.gov.br/api/v1';
const ITAPEVI_CODE = '3522505';
const POPULATION_INDICATOR = '29171';

const DadosIbgeSchema = z.object({}).optional();

export const toolDefinition = {
  name: 'dados_ibge',
  description: 'Retorna a estimativa populacional de Itapevi pela série oficial do IBGE.',
  inputSchema: { type: 'object', properties: {} },
};

type PopulationResponse = Array<{ res?: Array<{ res?: Record<string, string> }> }>;

function latestEstimate(payload: PopulationResponse): { year: string; population: number } {
  const series = payload[0]?.res?.[0]?.res ?? {};
  const years = Object.keys(series).filter((year) => /^\d{4}$/.test(year)).sort((a, b) => Number(a) - Number(b));
  const year = years.at(-1);
  const population = year ? Number(series[year]) : Number.NaN;
  if (!year || !Number.isFinite(population) || population <= 0) throw new Error('Estimativa populacional IBGE indisponivel ou invalida.');
  return { year, population };
}

export async function handler(args: unknown) {
  try {
    DadosIbgeSchema.parse(args);
    const cacheKey = 'ibge_itapevi_population_v2';
    const cached = getCached<string>(cacheKey);
    if (cached) return { content: [{ type: 'text', text: cached }] };

    const [localityResponse, populationResponse] = await Promise.all([
      axios.get(`${IBGE_API}/localidades/municipios/${ITAPEVI_CODE}`),
      axios.get<PopulationResponse>(`${IBGE_API}/pesquisas/indicadores/${POPULATION_INDICATOR}/resultados/${ITAPEVI_CODE}`),
    ]);
    const locality = localityResponse.data as { nome?: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } };
    const { year, population } = latestEstimate(populationResponse.data);
    const municipality = locality.nome?.trim() || 'Itapevi';
    const uf = locality.microrregiao?.mesorregiao?.UF?.sigla ?? 'SP';
    const text = [
      `Dados demograficos de ${municipality} (${uf}) - IBGE:`,
      `  - Estimativa populacional: ${population.toLocaleString('pt-BR')} habitantes (${year}).`,
      `  - Fonte: IBGE, indicador ${POPULATION_INDICATOR}, consulta em ${new Date().toISOString().slice(0, 10)}.`,
      '  - Limite: esta ferramenta nao informa area territorial, densidade ou PIB sem uma fonte oficial especifica e validada.',
    ].join('\n');
    setCache(cacheKey, text, 60 * 60 * 24);
    return { content: [{ type: 'text', text }] };
  } catch (error: unknown) {
    console.error('Erro ao buscar estimativa populacional IBGE:', error instanceof Error ? error.message : error);
    return { content: [{ type: 'text', text: 'Nao foi possivel obter a estimativa populacional oficial do IBGE no momento. Tente novamente mais tarde.' }] };
  }
}
