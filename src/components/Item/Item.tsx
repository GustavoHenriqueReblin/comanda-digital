import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useRememberContext } from "../../contexts/remember";
import './item.scss';

interface ItemProps {
    id: Number;
    title: string;
    price: string;
    description: string;
    isSelectedByUser?: () => boolean | null;
};

function Item({ id, title, price, description, isSelectedByUser }: ItemProps) {
    const [isSelected, setIsSelected] = useState(isSelectedByUser !== null ? isSelectedByUser : false);
    const { setProductSelectedIds } = useRememberContext();
    const formattedPrice = Number(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const saveProductState = () => {
        setIsSelected((prevIsSelected) => {
            const updatedIsSelected = !prevIsSelected;
    
            setProductSelectedIds((prevIds) => {
                const actualIds = prevIds ?? [];
    
                const updatedIds = updatedIsSelected
                    ? [...actualIds, id] // Insere o id do produto que foi selecionado
                    : actualIds.filter((existingId: number) => existingId !== id); // Remove o id do produto que foi selecionado
    
                sessionStorage.setItem('productSelectedIds', JSON.stringify(updatedIds));
                return updatedIds as [number];
            });
    
            return updatedIsSelected;
        });
    };

    return (
        <div onClick={() => saveProductState()} className={`item ${isSelected ? 'selected' : ''}`}>
            <div className="item-title-container">
                <h2 className="item-title">{ title }</h2>
            </div>
            <div className="price">{ formattedPrice }</div>
            <div className="description">{ description }</div>
            {isSelected && (
                <div className="check">
                    <FaCheck />
                </div>
            )}
        </div>
    )
}

export default Item;