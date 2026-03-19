export declare const toolDefinition: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            bairro: {
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
//# sourceMappingURL=demandas.d.ts.map