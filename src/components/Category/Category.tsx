import './category.scss';
import { Category as CategoryType } from '../../types/types';

import React from "react";

interface CategoryProps {
    isSelected: boolean;
    data: CategoryType | null;
    onClick: (herSelf: CategoryType | null) => void;
};

function Category({ isSelected, data, onClick }: CategoryProps) {
    return (
        <>
            <div onClick={() => onClick(data)} className={`category-container ${isSelected && 'selected'}`}>
                <div className='icon-area'>
                    <span className='icon'></span>
                </div>
                <span className='name'>{ data !== null ? data.name : 'Todos' }</span>
            </div>
        </>
    )
}

export default Category;