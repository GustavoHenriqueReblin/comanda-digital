/* eslint-disable react-hooks/exhaustive-deps */
import './resumeOrder.scss';
import { Order, Product } from "../../types/types";
import { GetProducts } from "../../graphql/queries/productQueries";

import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";


interface ResumeOrderProps {
    orderData: Order
};

function ResumeOrder({ orderData }: ResumeOrderProps) {
    const [getProducts] = useLazyQuery(GetProducts);
    const [productData, setProductData] = useState<Product[] | null>(null);

    useEffect(() => { 
        if (!productData) {
            const fetchProducts = async () => {
                return new Promise((resolve, reject) => {
                    const itemsProductsIds = orderData.items.map((item) => Number(item.productId));
                    getProducts({ variables: { filter: { productsIds: itemsProductsIds } } })
                        .then(res => {
                            resolve(res.data.products);
                        })
                        .catch(error => {
                            reject(error);
                        });
                  });
            };

            fetchProducts()
                .then(data => {
                    setProductData(data as Product[]);
                })
                .catch((error) => {
                    console.error("Erro ao buscar os produtos do pedido: ", error);
                })
        }
    }, [productData, getProducts]);

    return (
        <>  
            { orderData ? (
                <>
                    <h2 className="title">Legal, seu pedido já foi confirmado!</h2>
                    <div className="info">Em alguns instantes, um dos nossos garçons irá vir recepcioná-lo(s).</div>
                    <div className="info">Um resumo do seu pedido:</div>
                    { productData && productData.length > 0
                    ? (
                        productData.map((product: any) => (
                            <span key={product.id}>{product.name}</span>
                        ))) 
                    : (
                        <></>
                    )} 
                </>
            )
            : (<></>)}
        </>
    )
}

export default ResumeOrder;