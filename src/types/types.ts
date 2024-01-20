export type User = {
    id: number,
    username: string,
    password: string,
    token: string
};

export type Category = {
    id: number,
    name: string
};

export type Product = {
    id: number,
    idCategory?: number,
    name: string,
    price: number,
    description: string
};

export type Table = {
    id: number,
    code: number,
    state: number
};

export enum Redirect {
    ROOT
};

export const routeTitles: Record<string, string> = {
    '/': 'Comanda digital - Mesas disponíveis',
    '/menu': 'Comanda digital - Menu',
};