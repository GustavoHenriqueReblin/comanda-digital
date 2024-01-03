import React, { useState } from "react";
import './totalizer.scss';
import { FiTrash } from "react-icons/fi";
import Modal from "../Modal/Modal";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: string;
};

function Totalizer({ isVisible, total }: TotalizerProps) {
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const formattedTotal = Number(total).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <>  
            { isVisible() && (
                <div className="totalizer-container">
                    <div className="value-container">
                        Total: <span className="value">{ formattedTotal }</span>
                    </div>
                    <div className="buttons">
                        <span onClick={() => setIsModalDeleteOpen(true)}><FiTrash /></span>
                    </div>
                </div>
            )}
            <Modal 
                title={"Deseja realmente limpar os itens selecionados?"}
                isOpen={isModalDeleteOpen} 
                onClose={() => {setIsModalDeleteOpen(false)}} 
            />
        </>
    )
}

export default Totalizer;