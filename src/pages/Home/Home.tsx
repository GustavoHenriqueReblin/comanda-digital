import { useLazyQuery } from "@apollo/client";
import './home.scss';
import React, { useEffect } from "react";
import TableCard from "../../components/TableCard/TableCard";
import { GetTables } from "../../graphql/queries/tableQueries";
import { useLocation } from "react-router-dom";
import { routeTitles } from "../../types/types";
import { Helmet } from "react-helmet";

function Home() {
  const [getTables, { data: tableData }] = useLazyQuery(GetTables);
  const location = useLocation();

  const pageTitle = routeTitles[location.pathname] || 'Comanda digital';

  useEffect(() => {
    const fetchTables = async () => {
      try {
        !tableData && (await getTables());
      } catch (error) {
        console.error("Erro ao buscar as mesas:", error);
      }
    };
  
    fetchTables();
    sessionStorage.removeItem('tableSelected');
  }, [getTables, tableData]);  

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
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