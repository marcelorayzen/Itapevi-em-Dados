import { z } from 'zod';

const BuscarDespesasSchema = z.object({
  ano: z.number().int().min(2000).max(2030),
  mes: z.number().int().min(1).max(12).optional(),
});

export const toolDefinition = {
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

export async function handler(args: unknown) {
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

    const dadosAno = despesasMock[params.ano as keyof typeof despesasMock];
    if (!dadosAno) {
      return { content: [{ type: 'text', text: `Dados para o ano ${params.ano} não disponíveis.` }] };
    }

    let resposta = `Despesas de ${params.ano}`;
    if (params.mes) resposta += ` - mês ${params.mes}`;
    resposta += ':\n';
    resposta += `Total: R$ ${dadosAno.total.toLocaleString('pt-BR')}\n`;
    resposta += 'Por órgão:\n';
    for (const [orgao, valor] of Object.entries(dadosAno.porOrgao)) {
      resposta += `  • ${orgao}: R$ ${valor.toLocaleString('pt-BR')}\n`;
    }

    return { content: [{ type: 'text', text: resposta }] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { content: [{ type: 'text', text: `Erro de validação: ${error.message}` }] };
    }
    throw error;
  }
}
