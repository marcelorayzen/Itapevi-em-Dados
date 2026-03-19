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
            limite: {
                type: string;
                description: string;
            };
        };
    };
};
export declare function handler(args: unknown): Promise<{
    content: {
        type: string;
        text: {};
    }[];
}>;
//# sourceMappingURL=diario-oficial.d.ts.map