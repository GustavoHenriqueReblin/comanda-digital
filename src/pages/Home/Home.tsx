import { useLazyQuery } from "@apollo/client";
import './home.scss';
import React, { useEffect } from "react";
import TableCard from "../../components/TableCard/TableCard";
import { GetTables } from "../../graphql/queries/tableQueries";

function Home() {
  const [getTables, { data: tableData }] = useLazyQuery(GetTables);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        !tableData && (await getTables());
      } catch (error) {
        console.error("Erro ao buscar as mesas:", error);
      }
    };
  
    fetchTables();
    sessionStorage.removeItem('idTableSelected');
  }, [getTables, tableData]);  

  return (
    <>
      <h2 className="title">
        Por favor, selecione uma das mesas disponíveis:
      </h2>
      <span className="info">
        Essa informação será necessária para que encontrem seu pedido.
      </span>
      <div className="tables-container">
        <div className="table-box-container">
          { !tableData
          ? null
          : tableData.tables.map((table: any) => (
              <TableCard 
                key={table.id} 
                id={table.id}
                code={table.code}
                state={table.state}
              />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;