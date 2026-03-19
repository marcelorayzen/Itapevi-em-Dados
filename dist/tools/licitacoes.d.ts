export declare const toolDefinition: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ano: {
                type: string;
                description: string;
            };
            modalidade: {
                type: string;
                description: string;
            };
        };
    };
};
export declare function handler(args: unknown): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=licitacoes.d.ts.map