/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import './home.scss';
import React, { useEffect, useState } from "react";
import TableCard from "../../components/TableCard/TableCard";
import { GetTables } from "../../graphql/queries/tableQueries";
import { useLocation, useNavigate } from "react-router-dom";
import { routeTitles, Table } from "../../types/types";
import { Helmet } from "react-helmet";
import Loading from "../../components/Loading";
import { CHANGE_TABLE_STATUS } from "../../graphql/subscriptions/table";
import { UPDATE_TABLE } from "../../graphql/mutations/table";

function Home() {
  const [getTables, { data: tableData }] = useLazyQuery(GetTables);
  const { data: tableStatusData } = useSubscription(CHANGE_TABLE_STATUS);
  const [updateTable] = useMutation(UPDATE_TABLE);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Table[] | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = routeTitles[location.pathname] || 'Comanda digital';

  useEffect(() => {
    if (!tableData) {
      const fetchTables = async () => {
        try {
          if (!tableData) {
            return new Promise((resolve, reject) => {
              getTables()
                .then(res => {
                    resolve(res.data.tables);
                })
                .catch(error => {
                    reject(error);
                });
            });
          }
        } catch (error) {
          console.error("Erro ao buscar as mesas: ", error);
        }
      };

      const updateTableSelected = async () => {
        try {
          const tableString = sessionStorage.getItem('tableSelected');
          if (tableString) {
            return new Promise((resolve, reject) => {
              const table = JSON.parse(tableString);
              const newState = !table.state;
              updateTable({
                variables: {
                  input: {
                    id: table.id,
                    code: table.code,
                    state: newState,
                  },
                },
              })
                .then(res => {
                  resolve(res.data.tables);
                })
                .catch(error => {
                  reject(error);
                });
            });
          }
        } catch (error) {
          console.error("Erro ao atualizar a mesa selecionada anteriormente: ", error);
        }
      };

      const orderDataString = sessionStorage.getItem('orderData');
      const orderData = orderDataString ? JSON.parse(orderDataString) : '';
      if (orderData && orderData !== '') {
        navigate('/menu');
      } else {
        updateTableSelected()
          .then(() => {
            sessionStorage.removeItem('tableSelected');
            return fetchTables();
          })
          .then((data) => {
            setData(data as Table[]);
            setLoading(false);
          })
          .catch((updateTableError) => {
            console.error("Erro ao atualizar a mesa selecionada anteriormente: ", updateTableError);
          })
          .catch((fetchTablesError) => {
              console.error("Erro ao buscar os mesas: ", fetchTablesError);
          })
      }
    }
  }, [tableData]);  

  useEffect(() => { 
    if (tableStatusData && tableStatusData.ChangeTableStatus !== null) {
      try {
        setLoading(true);
        setData(
          (tableStatusData?.ChangeTableStatus || []).map((table: any) => {
            return {
              ...table.data,
            } as Table;
          })
        );
      } finally {
        setLoading(false);  
      }
    }
  }, [tableStatusData]);

  return (
    <>
      {loading 
      ? (<Loading title="Aguarde, carregando cardápio..." />) 
      : (
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
              { data && data.length > 0
              ? (
                data.map((table: any) => (
                  <TableCard 
                    key={table.id} 
                    id={table.id}
                    code={table.code}
                    state={table.state}
                  />
              ))) 
              : (
                <></>
              )} 
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;