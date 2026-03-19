export interface Demanda {
    bairro: string;
    categoria: string;
    quantidade: number;
}
export interface Despesa {
    ano: number;
    mes?: number;
    orgao: string;
    valor: number;
}
export interface Licitacao {
    ano: number;
    modalidade: string;
    objeto: string;
    valor: number;
    situacao: string;
}
export interface Lei {
    numero: string;
    ano: number;
    ementa: string;
    link?: string;
}
export interface DadosIBGE {
    populacao: number;
    area: number;
    densidade: number;
    pib: number;
    idh: number;
}
//# sourceMappingURL=index.d.ts.map