import './queue.scss';
import Loading from "../../components/Loading";
import ResumeOrder from "../../components/ResumeOrder/ResumeOrder";
import { Order, routeTitles } from "../../types/types";
import { GetOrder } from '../../graphql/queries/order';

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery } from '@apollo/client';

function Queue() {
    const location = useLocation();
    const pageTitle = routeTitles[location.pathname] || 'Comanda digital';
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [getOrder] = useLazyQuery(GetOrder);
    const navigate = useNavigate();

    useEffect(() => { 
        const verifyOrder = async (orderId: Number) => {
            try {
                const res = await getOrder({ variables: { input: { id: orderId } } });
                const data = res?.data?.order;
        
                if (data && data !== null) {
                    return data;
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Erro ao buscar o pedido: ", error);
                return null;
            }
        };

        if (!orderData) {
            const orderDataString = localStorage.getItem('orderData');
            const orderData = orderDataString ? JSON.parse(orderDataString) : '';
            if (orderData && orderData !== '') {
                const availableStatus = [0,1,2];
                verifyOrder(orderData.id).then((res) => {
                    if (res && res !== null && availableStatus.includes(res.status)) {
                        loading && setLoading(false); 
                        setOrderData(orderData);
                    } else {
                        localStorage.removeItem('orderData');
                        localStorage.removeItem('categoryExpandedIds');
                        localStorage.removeItem('productsSelected');
                        navigate('/');
                    }
                })
            } else {
                navigate('/')
            }
        }    
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