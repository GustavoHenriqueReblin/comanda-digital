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

export type OrderItems = {
    id: number,
    orderId: number,
    productId: number,
    value: number,
    status: number, // 0: Cancelado, 1: Confirmado
};

export type Order = {
    id: number,
    bartenderId: number,
    bertenderName: string,
    tableId: number,
    value: number,
    date: Date,
    status: number, // 0: Concluído, 1: Resgatado, 2: Confirmado, 3: Finalizado, 4: Cancelado
    items: [OrderItems],
};

export const routeTitles: Record<string, string> = {
    '/': 'Comanda digital - Mesas disponíveis',
    '/menu': 'Comanda digital - Menu',
    '/queue': 'Comanda digital - Fila de espera',
};