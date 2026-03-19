import { z } from 'zod';

const BuscarLeiSchema = z.object({
  palavra_chave: z.string().min(3),
});

export const toolDefinition = {
  name: 'buscar_lei',
  description: 'Pesquisa legislação municipal por palavra-chave',
  inputSchema: {
    type: 'object',
    properties: {
      palavra_chave: { type: 'string', description: 'Palavra-chave para busca' },
    },
    required: ['palavra_chave'],
  },
};

export async function handler(args: unknown) {
  try {
    const params = BuscarLeiSchema.parse(args);

    // Mock de leis
    const leisMock = [
      { numero: '1234/2023', ementa: 'Dispõe sobre a criação do programa de coleta seletiva', ano: 2023 },
      { numero: '5678/2022', ementa: 'Institui o plano diretor de Itapevi', ano: 2022 },
      { numero: '9012/2021', ementa: 'Estabelece normas para feiras livres', ano: 2021 },
    ];

    const resultados = leisMock.filter(lei =>
      lei.ementa.toLowerCase().includes(params.palavra_chave.toLowerCase())
    );

    if (resultados.length === 0) {
      return { content: [{ type: 'text', text: `Nenhuma lei encontrada com a palavra "${params.palavra_chave}".` }] };
    }

    const linhas = [`Leis contendo "${params.palavra_chave}":`];
    for (const lei of resultados) {
      linhas.push(`  • Lei nº ${lei.numero} - ${lei.ementa}`);
    }
    return { content: [{ type: 'text', text: linhas.join('\n') }] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { content: [{ type: 'text', text: `Erro de validação: ${error.message}` }] };
    }
    throw error;
  }
}
