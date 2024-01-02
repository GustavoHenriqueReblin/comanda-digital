import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import './item.scss';

interface ItemProps {
    title: string;
    price: string;
    description: string;
};

function Item({ title, price, description }: ItemProps) {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <div onClick={() => setIsSelected(!isSelected)} className={`item ${isSelected ? 'selected' : ''}`}>
            <div className="item-title-container">
                <h2 className="item-title">{ title }</h2>
            </div>
            <div className="price">{ `R$ ` + price }</div>
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