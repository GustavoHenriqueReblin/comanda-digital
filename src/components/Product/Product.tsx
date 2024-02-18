import './product.scss';

import React from "react";

interface ProductProps {
    img?: string;
    name: string;
    ratingValue: number;
    price: number;
};

function Product({ name, ratingValue, price }: ProductProps) {
    const formattedPrice = Number(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <>
            <div className='product-container'>
                <div className='img'></div>
                <div className='name'>{ name }</div>
                <div className='rating'><span>⭐</span>{ ratingValue }</div>
                <div className='price'>{ formattedPrice }</div>
            </div>
        </>
    )
}

export default Product;