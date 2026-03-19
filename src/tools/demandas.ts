import { z } from 'zod';

const BuscarDemandasSchema = z.object({
  bairro: z.string().optional(),
});

type BuscarDemandasParams = z.infer<typeof BuscarDemandasSchema>;

export const toolDefinition = {
  name: 'buscar_demandas_por_bairro',
  description: 'Retorna as principais demandas da população por bairro (dados do projeto Pensando em Itapevi)',
  inputSchema: {
    type: 'object',
    properties: {
      bairro: {
        type: 'string',
        description: 'Nome do bairro (opcional - se omitido, retorna todos)',
      },
    },
  },
};

export async function handler(args: unknown) {
  try {
    const params = BuscarDemandasSchema.parse(args) as BuscarDemandasParams;

    // Dados mockados (substituir por dados reais futuramente)
    const demandasMock: Record<string, Record<string, number>> = {
      'Jardim São Paulo': { saude: 45, educacao: 32, seguranca: 28, transporte: 15, lazer: 10 },
      Centro: { saude: 20, educacao: 18, seguranca: 35, transporte: 25, lazer: 30 },
      'Vila Aurora': { saude: 38, educacao: 22, seguranca: 19, transporte: 27, lazer: 12 },
    };

    if (params.bairro) {
      const dados = demandasMock[params.bairro];
      if (!dados) {
        return {
          content: [{ type: 'text', text: `Bairro "${params.bairro}" não encontrado.` }],
        };
      }
      const linhas = [`Demandas em ${params.bairro}:`];
      for (const [categoria, quantidade] of Object.entries(dados)) {
        linhas.push(`  • ${categoria}: ${quantidade} solicitações`);
      }
      return { content: [{ type: 'text', text: linhas.join('\n') }] };
    }

    // Resumo geral
    const linhas = ['Demandas por bairro:'];
    for (const [bairro, demandas] of Object.entries(demandasMock)) {
      const total = Object.values(demandas).reduce((a, b) => a + b, 0);
      const top = Object.entries(demandas).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      linhas.push(`  • ${bairro}: ${total} demandas (principal: ${top})`);
    }
    return { content: [{ type: 'text', text: linhas.join('\n') }] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [{ type: 'text', text: `Erro de validação: ${error.message}` }],
      };
    }
    throw error;
  }
}
