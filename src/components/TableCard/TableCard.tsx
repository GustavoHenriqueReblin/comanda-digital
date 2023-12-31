import React from "react";
import './tableCard.scss';
import { useNavigate } from 'react-router-dom';

interface TableProps {
    id: number;
    code: string;
    state: boolean;
};

function TableCard({ id, code, state }: TableProps) {
    const navigate = useNavigate();

    const saveTable = () => {
        if (state) {
            const tableObj = { id, code, state };
            sessionStorage.setItem('tableSelected', JSON.stringify(tableObj));
            navigate('/menu');
        }
    };

    return (
        <>
            <div onClick={() => saveTable()} className={`table ${state ? 'free' : 'not-free'}`}>
                <h2 className="code">{ code }</h2>
            </div>
        </>
    );
}
    
export default TableCard;