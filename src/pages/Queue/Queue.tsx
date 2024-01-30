import './queue.scss';
import Loading from "../../components/Loading";
import ResumeOrder from "../../components/ResumeOrder/ResumeOrder";
import { Order, routeTitles } from "../../types/types";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

function Queue() {
    const location = useLocation();
    const pageTitle = routeTitles[location.pathname] || 'Comanda digital';
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        if (!orderData) {
            const orderDataString = localStorage.getItem('orderData');
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
                    { orderData 
                    ? (
                        <div className="resume-container">
                            <ResumeOrder orderData={orderData} />
                        </div>
                    ) 
                    : (
                        <></>
                    )} 
                </div>
            )}
        </>
    )
}

export default Queue;