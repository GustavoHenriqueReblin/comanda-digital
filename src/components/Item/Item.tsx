import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import './item.scss';

interface ItemProps {
    id: Number;
    title: string;
    price: string;
    description: string;
    isSelectedByUser?: Boolean | null;
};

function Item({ id, title, price, description, isSelectedByUser }: ItemProps) {
    const [isSelected, setIsSelected] = useState(isSelectedByUser !== null ? isSelectedByUser : false);
    const formattedPrice = Number(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <div onClick={() => setIsSelected(!isSelected)} className={`item ${isSelected ? 'selected' : ''}`}>
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