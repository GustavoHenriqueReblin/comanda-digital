import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useRememberContext } from "../../contexts/remember";
import { Product } from "../../types/types";
import './item.scss';

interface ItemProps {
    id: number;
    title: string;
    price: string;
    description: string;
    isSelectedByUser?: () => boolean | null;
    hasOrderConfirmed?: boolean;
};

function Item({ id, title, price, description, isSelectedByUser, hasOrderConfirmed }: ItemProps) {
    const [isSelected, setIsSelected] = useState(isSelectedByUser !== null ? isSelectedByUser : false);
    const { setProductsSelected, setResetProducts, resetProducts } = useRememberContext();
    const formattedPrice = Number(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    useEffect(() => {
        if (resetProducts) {
            setResetProducts(false);
            setIsSelected(false);
        }
    }, [resetProducts, setResetProducts]);

    const saveProductState = () => {
        if (hasOrderConfirmed) {
            return;
        }

        setIsSelected((prevIsSelected) => {
            const updatedIsSelected = !prevIsSelected;
    
            setProductsSelected((prevProducts): Product[] | [] => {
                const actualProducts = prevProducts ?? [];
                const newProduct: Product = {
                    id: Number(id),
                    name: title,
                    price: Number(price),
                    description: description
                };
                
                const updatedProducts: Product[] | [] = updatedIsSelected
                    ? [...actualProducts, newProduct]
                    : actualProducts.filter(product => Number(product.id) !== Number(id));

                sessionStorage.setItem('productsSelected', JSON.stringify(updatedProducts));
                return updatedProducts;
            });

            return updatedIsSelected;
        });
    };

    return (
        <div onClick={() => saveProductState()} className='item'>
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