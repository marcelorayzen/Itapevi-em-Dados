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
            mes: {
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
//# sourceMappingURL=transparencia.d.ts.map