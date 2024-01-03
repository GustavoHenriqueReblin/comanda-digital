import React from "react";
import './totalizer.scss';
import { FiTrash } from "react-icons/fi";

interface TotalizerProps {
    isVisible: () => boolean | null;
    total: string;
};

function Totalizer({ isVisible, total }: TotalizerProps) {
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
                        <FiTrash />
                    </div>
                </div>
            )}
        </>
    )
}

export default Totalizer;