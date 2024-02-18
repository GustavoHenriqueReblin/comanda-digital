/* eslint-disable react-hooks/exhaustive-deps */
import './resumeOrder.scss';
import { Order, Product } from "../../types/types";
import { GetProducts } from "../../graphql/queries/productQueries";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";

interface ResumeOrderProps {
    orderData: Order
};

function ResumeOrder({ orderData }: ResumeOrderProps) {
    const [productData, setProductData] = useState<Product[] | null>(null);
    
    const itemsProductsIds = orderData.items.map((item) => Number(item.productId));
    useQuery(GetProducts, {
        variables: { filter: { productsIds: itemsProductsIds } },
        onCompleted: (res) => {
            const data = res.products;
            setProductData(data as Product[]);
        },
        onError: (error) => {
            console.error("Erro ao buscar os produtos: ", error);
        }
    });

    return (
        <>  
            { orderData && (
                <>
                    {orderData?.bertenderName !== null ? (
                        <>
                            <h2 className="title">Legal, seu pedido já foi resgatado!</h2>
                            <div className="info">O garçom {orderData.bertenderName} está vindo até sua mesa.</div>
                        </>
                    ) : (
                        <>
                            <h2 className="title">Legal, seu pedido já foi confirmado!</h2>
                            <div className="info">Em alguns instantes, um dos nossos garçons irá vir recepcioná-lo(s).</div>
                        </>
                    )}
                    
                    <div className="info">Um resumo do seu pedido:</div>
                    { productData && productData.length > 0 && ( productData.map((product: any) => (
                        <span key={product.id}>{product.name}</span>
                    )))} 
                </>
            )}
        </>
    )
}

export default ResumeOrder;