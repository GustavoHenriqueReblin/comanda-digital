import React, { useState } from "react";
import './totalizer.scss';
import { FiTrash } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import Modal from "../Modal/Modal";
import { useRememberContext } from "../../contexts/remember";
import { Product } from "../../types/types";
import { CREATE_ORDER } from "../../graphql/mutations/order";
import { useMutation } from "@apollo/client";
import { getDateTime } from "../../helper";
import { useNavigate } from "react-router-dom";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: () => string;
};

function Totalizer({ isVisible, total }: TotalizerProps) {
    const [isModalClearOpen, setIsModalClearOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const { setProductsSelected, setResetProducts } = useRememberContext();
    const [createOrder] = useMutation(CREATE_ORDER);
    const formattedTotal = Number(total()).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const navigate = useNavigate();

    const clearItems = () => {
        try {
            setProductsSelected((prevProducts) => {
                const updatedProducts: Product[] | [] = [];
                sessionStorage.setItem('productsSelected', JSON.stringify(updatedProducts));
                setResetProducts(true);
                return updatedProducts;
            });
        } finally {
            setIsModalClearOpen(false);
        }
    };

    const confirmOrder = async () => {
        try {
            const selectedProducts = JSON.parse(sessionStorage.getItem('productsSelected') || '');
            const selectedTable = JSON.parse(sessionStorage.getItem('tableSelected') || '');

            try {
                const res = await createOrder({
                    variables: {
                        input: {
                            id: 0,
                            bartenderId: -1,
                            tableId: selectedTable.id,
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
    
                res.data && sessionStorage.setItem('productsSelected', res.data.createOrder.data);
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
                    <div className="buttons-container" onClick={() => setIsModalClearOpen(true)}>
                        <div className="button clear">
                            <span><FiTrash /></span>
                        </div>
                    </div>
                    <div className="value-container">
                        Total: <span className="value">{ formattedTotal }</span>
                    </div>
                    <div className="buttons-container" onClick={() => setIsModalConfirmOpen(true)}>
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