import './product.scss';
import { Product as ProductType } from '../../types/types';

import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

interface ProductProps {
    isSelected: boolean;
    data: ProductType;
    onClick: (himSelf: ProductType) => void;
};

function Product({ data, onClick, isSelected }: ProductProps) {
    const formattedPrice = Number(data.price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <>
            <div onClick={() => onClick(data)} className={`product-container ${isSelected && 'selected'}`}>
                {isSelected && (<span className='check'><FaRegCircleCheck /></span>)}
                <div className='img'></div>
                <div className='name'>{ data.name }</div>
                <div className='rating'><span>⭐</span>{ 1 }</div> {/* data.ratingValue */}
                <div className='price'>{ formattedPrice }</div>
            </div>
        </>
    )
}

export default Product;