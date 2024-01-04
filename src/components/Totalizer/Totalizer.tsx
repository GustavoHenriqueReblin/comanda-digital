import React, { useState } from "react";
import './totalizer.scss';
import { FiTrash } from "react-icons/fi";
import Modal from "../Modal/Modal";
import { useRememberContext } from "../../contexts/remember";
import { Product } from "../../types/types";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: string;
};

function Totalizer({ isVisible, total }: TotalizerProps) {
    const [isModalClearOpen, setIsModalClearOpen] = useState(false);
    const { setProductsSelected, setResetProducts } = useRememberContext();
    const formattedTotal = Number(total).toLocaleString('pt-BR', {
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

    return (
        <>  
            { isVisible() && (
                <div className="totalizer-container">
                    <div className="value-container">
                        Total: <span className="value">{ formattedTotal }</span>
                    </div>
                    <div className="buttons">
                        <span onClick={() => setIsModalClearOpen(true)}><FiTrash /></span>
                    </div>
                </div>
            )}
            <Modal 
                title={"Deseja realmente limpar os itens selecionados?"}
                isOpen={isModalClearOpen} 
                onClose={() => {setIsModalClearOpen(false)}} 
                onConfirm={() => clearItems()}
            />
        </>
    )
}

export default Totalizer;