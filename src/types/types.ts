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

type Page = {
    route: string;
    title: string;
    name: string;
};

export const routes: Page[] = [
    {route: '/', title: 'Comanda digital - Página Inicial', name: 'Página Inicial' },
    {route: '/menu', title: 'Comanda digital - Cardápio', name: 'Cardápio' },
    {route: '/queue', title: 'Comanda digital - Seus pedidos', name: 'Seus pedidos' },
    {route: '/login', title: 'Comanda digital - Login', name: 'Login' },
    {route: '/admin/products', title: 'Comanda digital - Produtos', name: 'Produtos' },
];