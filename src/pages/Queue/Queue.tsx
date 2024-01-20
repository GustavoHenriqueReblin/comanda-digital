import React, { useEffect, useState } from "react";
import './queue.scss';

import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { Order, routeTitles } from "../../types/types";
import Loading from "../../components/Loading";

function Queue() {
    const location = useLocation();
    const pageTitle = routeTitles[location.pathname] || 'Comanda digital';
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        if (!orderData) {
            const orderDataString = sessionStorage.getItem('orderData');
            const orderData = orderDataString ? JSON.parse(orderDataString) : '';
            if (orderData && orderData !== '') {
                setOrderData(orderData);
            }
        }    
        setLoading(false); 
    }, [orderData, setOrderData]);

    return (
        <>
            { loading 
            ? (<Loading title="Aguarde, carregando seu pedido..." />) 
            : (
                <div className="queue-container">
                    <Helmet>
                        <title>{pageTitle}</title>
                    </Helmet>
                    <h2 className="title">Seu pedido já foi confirmado!</h2>
                    <span className="info">Em alguns instantes, um dos nossos garçons irá vir recepcioná-los.</span>
                    <br/>
                    <span className="info">Um resumo do seu pedido:</span>
                    <div className="resume-container">
                        { orderData 
                        ? (
                            <span>{JSON.stringify(orderData)}</span>
                        ) 
                        : (
                            <></>
                        )} 
                    </div>
                </div>
            )}
        </>
    )
}

export default Queue;