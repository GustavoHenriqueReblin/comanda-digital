import React, { useState } from "react";
import './totalizer.scss';
import { FiTrash } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import Modal from "../Modal/Modal";
import { useRememberContext } from "../../contexts/remember";
import { Product } from "../../types/types";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: () => string;
};

function Totalizer({ isVisible, total }: TotalizerProps) {
    const [isModalClearOpen, setIsModalClearOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const { setProductsSelected, setResetProducts } = useRememberContext();
    const formattedTotal = Number(total()).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

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

    const confirmOrder = () => {
        try {
            
        } finally {
            setIsModalConfirmOpen(false);
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