import React, { useState } from "react";
import './card.scss';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface CardProps {
    title: string;
    children: any;
};

function Card({ title, children }: CardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className="card">
                <div onClick={() => setIsExpanded(!isExpanded)} className="card-header">
                    <h2 className="card-title">{ title }</h2>
                    { isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown /> } 
                </div>
                {
                    isExpanded && (
                        <div className={`card-content ${isExpanded ? ' expanded' : ''}`}>
                            { children }
                        </div>
                    )
                }
            </div>
        </>
    );
}
    
export default Card;