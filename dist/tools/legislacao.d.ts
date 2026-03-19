export declare const toolDefinition: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            palavra_chave: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handler(args: unknown): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=legislacao.d.ts.map