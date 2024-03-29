import './tableCard.scss';
import { UPDATE_TABLE } from "../../graphql/mutations/table";

import React from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@apollo/client";

interface TableProps {
    id: number;
    code: string;
    state: boolean;
};

function TableCard({ id, code, state }: TableProps) {
    const navigate = useNavigate();
    const [updateTable] = useMutation(UPDATE_TABLE);

    const saveTable = async () => {
        const newState = !state;
        const tableObj = { id, code, state: newState };
        
        localStorage.setItem('tableSelected', JSON.stringify(tableObj));
        await updateTable({
            variables: {
                input: {
                    id,
                    code,
                    state: newState,
                },
            },
        });
        navigate('/menu');
    };

    return (
        <>
            <div onClick={() => state && saveTable()} className={`table ${state ? 'free' : 'not-free'}`}>
                <h2 className="code">{ code }</h2>
            </div>
        </>
    );
}
    
export default TableCard;