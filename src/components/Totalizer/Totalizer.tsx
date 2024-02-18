import './totalizer.scss';
import Modal from "../Modal/Modal";
import { getDateTime } from "../../helper";
import { CREATE_ORDER } from "../../graphql/mutations/order";

import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: () => string;
    hasOrderConfirmed?: boolean | null;
};

function Totalizer({ isVisible, total, hasOrderConfirmed }: TotalizerProps) {
    const [isModalClearOpen, setIsModalClearOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [createOrder] = useMutation(CREATE_ORDER);
    const formattedTotal = Number(total()).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const navigate = useNavigate();

    const clearItems = () => {
        try {
            const updatedProducts: [] = [];
            localStorage.setItem('productsSelected', JSON.stringify(updatedProducts));
        } finally {
            setIsModalClearOpen(false);
        }
    };

    const confirmOrder = async () => {
        try {
            const selectedProductsString = localStorage.getItem('productsSelected');
            const selectedProducts = selectedProductsString ? JSON.parse(selectedProductsString) : '';
            const selectedTableString = localStorage.getItem('tableSelected');
            const selectedTable = selectedTableString ? JSON.parse(selectedTableString) : '';

            try {
                const res = await createOrder({
                    variables: {
                        input: {
                            id: 0,
                            bartenderId: -1,
                            tableId: selectedTable.id,
                            tableCode: selectedTable.code,
                            date: getDateTime(),
                            value: Number(total()),
                            status: 0,
                            items: selectedProducts?.map((product: any) => ({
                                    id: 0,
                                    orderId: 0,
                                    productId: product.id.toString(),
                                    value: product.price,
                                    status: 1,
                                }))
                        },
                    },
                });
    
                res.data && localStorage.setItem('orderData', JSON.stringify(res.data.createOrder.data));
            } finally {
                setIsModalConfirmOpen(false);
                navigate('/queue');
            }
        } catch (error) {
            console.error('Erro ao registrar o pedido: ', error);
        }
    }

    return (
        <>  
            { isVisible() && (
                <div className="totalizer-container">
                    <div className={`buttons-container ${hasOrderConfirmed ? 'block' : ''}`} onClick={() => {!hasOrderConfirmed && setIsModalClearOpen(true)}}>
                        <div className="button clear">
                            <span><FiTrash /></span>
                        </div>
                    </div>
                    <div className="value-container">
                        Total: <span className="value">{ formattedTotal }</span>
                    </div>
                    <div className={`buttons-container ${hasOrderConfirmed ? 'block' : ''}`} onClick={() => {!hasOrderConfirmed && setIsModalConfirmOpen(true)}}>
                        <div className="button confirm">
                            <span><FaCheck /></span>
                        </div>
                    </div>
                </div>
            )}
            <Modal 
                title={"Deseja realmente limpar os itens selecionados?"}
                isOpen={isModalClearOpen} 
                onClose={() => {setIsModalClearOpen(false)}} 
                onConfirm={() => clearItems()}
            />
            <Modal 
                title={"Deseja realmente confirmar o pedido?"}
                isOpen={isModalConfirmOpen} 
                onClose={() => {setIsModalConfirmOpen(false)}} 
                onConfirm={() => confirmOrder()}
            />
        </>
    )
}

export default Totalizer;