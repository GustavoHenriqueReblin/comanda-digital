import './queue.scss';
import Loading from "../../components/Loading";
import ResumeOrder from "../../components/ResumeOrder/ResumeOrder";
import { Order, routeTitles } from "../../types/types";
import { GetOrder } from '../../graphql/queries/order';
import { CHANGE_ORDER_STATUS } from '../../graphql/subscriptions/order';

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery, useSubscription } from '@apollo/client';

function Queue() {
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const pageTitle = routeTitles[location.pathname] || 'Comanda digital';

    const [getOrder] = useLazyQuery(GetOrder);
    const { data: subscriptionOrdersData } = useSubscription(CHANGE_ORDER_STATUS);

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
                        setOrderData(res);
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

    useEffect(() => { 
        if (subscriptionOrdersData && subscriptionOrdersData.ChangeOrderStatus) {
            const orderDataString = localStorage.getItem('orderData');
            const orderData = orderDataString ? JSON.parse(orderDataString) : '';
    
            if (orderData && orderData !== '') {
                const findedOrder = subscriptionOrdersData.ChangeOrderStatus.find(
                    (order: any) => order.data && order.data.id === orderData.id 
                );
                
                if (findedOrder) {
                    if (findedOrder.data.status === 4) {
                        // Caso o pedido local seja cancelado, volta automaticamente para a home
                        localStorage.removeItem('orderData');
                        localStorage.removeItem('categoryExpandedIds');
                        localStorage.removeItem('productsSelected');
                        navigate('/');
                    } else if (findedOrder.data.status === 1 && findedOrder.data.bartenderId > 0) {
                        // Caso o pedido local tenha sido resgatado
                        setOrderData(findedOrder.data);
                    }
                }
            }
        }
    }, [subscriptionOrdersData]);

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