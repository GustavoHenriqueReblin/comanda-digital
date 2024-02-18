import './queue.scss';
import Loading from "../../components/Loading";
import ResumeOrder from "../../components/ResumeOrder/ResumeOrder";
import { Order, routes } from "../../types/types";
import { GetOrder } from '../../graphql/queries/order';
import { CHANGE_ORDER_STATUS } from '../../graphql/subscriptions/order';

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useSubscription } from '@apollo/client';

function Queue() {
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = routes.find(page => page.route === location.pathname);
    const pageTitle = currentPage ? currentPage.title : 'Comanda digital';

    useQuery(GetOrder, { 
        variables: { input: { id: () => {
            const orderDataString = localStorage.getItem('orderData');
            const orderData = orderDataString ? JSON.parse(orderDataString) : '';
            if (orderData && orderData !== '') {
                return orderData.id | 0;
            } else {
                navigate('/');
            }
        }}},
        onCompleted: (res) => {
            const availableStatus = [0,1,2];
            if (res && res !== null && availableStatus.includes(res.status)) {
                setLoading(false); 
                setOrderData(res);
            } else {
                localStorage.removeItem('orderData');
                localStorage.removeItem('categoryExpandedIds');
                localStorage.removeItem('productsSelected');
                navigate('/');
            }
        },
        onError: (error) => {
            console.error("Erro ao buscar o pedido: ", error);
            setLoading(false);
        }
    });

    useSubscription(CHANGE_ORDER_STATUS, {
        onSubscriptionData: (res) => {
            const orderDataString = localStorage.getItem('orderData');
            const orderData = orderDataString ? JSON.parse(orderDataString) : '';
    
            if (orderData && orderData !== '') {
                const findedOrder = res.subscriptionData.data.ChangeOrderStatus.find(
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
    });

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
                    && (
                        <div className="resume-container">
                            <ResumeOrder orderData={orderData} />
                        </div>
                    )} 
                </div>
            )}
        </>
    )
}

export default Queue;