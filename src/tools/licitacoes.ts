import { z } from 'zod';

const BuscarLicitacoesSchema = z.object({
  ano: z.number().int().min(2000).max(2035).optional(),
  modalidade: z.string().optional(),
});

export const toolDefinition = {
  name: 'buscar_licitacoes',
  description: 'Retorna licitações de Itapevi (mock / placeholder)',
  inputSchema: {
    type: 'object',
    properties: {
      ano: { type: 'number', description: 'Ano de referência' },
      modalidade: { type: 'string', description: 'Modalidade de licitação (opcional)' },
    },
  },
};

export async function handler(args: unknown) {
  try {
    const params = BuscarLicitacoesSchema.parse(args);

    const base = [
      { ano: 2024, modalidade: 'Pregão', objeto: 'Compra de materiais de limpeza', valor: 450000 },
      { ano: 2024, modalidade: 'Concorrência', objeto: 'Obras de pavimentação', valor: 3000000 },
      { ano: 2023, modalidade: 'Tomada de Preços', objeto: 'Serviços de manutenção elétrica', valor: 620000 },
    ];

    let resultados = base;

    if (params.ano) {
      resultados = resultados.filter(item => item.ano === params.ano);
    }

    if (params.modalidade) {
      resultados = resultados.filter(item => item.modalidade.toLowerCase() === params.modalidade!.toLowerCase());
    }

    if (resultados.length === 0) {
      return { content: [{ type: 'text', text: `Nenhuma licitação encontrada para os filtros informados.` }] };
    }

    const linhas = ['Licitações de Itapevi:'];
    resultados.forEach(item => {
      linhas.push(`  • [${item.ano}] ${item.modalidade} - ${item.objeto} (R$ ${item.valor.toLocaleString('pt-BR')})`);
    });

    return { content: [{ type: 'text', text: linhas.join('\n') }] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { content: [{ type: 'text', text: `Erro de validação: ${error.message}` }] };
    }
    throw error;
  }
}
