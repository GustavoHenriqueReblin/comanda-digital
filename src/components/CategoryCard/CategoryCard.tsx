import React, { useState } from "react";
import './categoryCard.scss';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRememberContext } from "../../contexts/remember";

interface CardProps {
    id: number;
    title: string;
    children: any;
    isExpandedByUser?: () => boolean | null;
};

function Card({ id, title, children, isExpandedByUser }: CardProps) {
    const [isExpanded, setIsExpanded] = useState(isExpandedByUser !== null ? isExpandedByUser : false);
    const { setCategoryExpandedIds } = useRememberContext();

    const saveCategoryState = () => {
        setIsExpanded((prevIsExpanded) => {
            const updatedIsExpanded = !prevIsExpanded;
    
            setCategoryExpandedIds((prevIds) => {
                const actualIds = prevIds ?? [];
    
                const updatedIds = updatedIsExpanded
                    ? [...actualIds, id] // Insere o id da categoria que foi expandida
                    : actualIds.filter((existingId: number) => existingId !== id); // Remove o id da categoria que foi expandida
    
                localStorage.setItem('categoryExpandedIds', JSON.stringify(updatedIds));
                return updatedIds as [number];
            });
    
            return updatedIsExpanded;
        });
    };
    
    return (
        <>
            <div className="card">
                <div onClick={() => saveCategoryState()} className="card-header">
                    <h2 className="card-title">{ title }</h2>
                    { isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown /> } 
                </div>
                {
                    isExpanded && (
                        <div className={`card-content ${isExpanded ? 'expanded' : ''}`}>
                            { children }
                        </div>
                    )
                }
            </div>
        </>
    );
}
    
export default Card;