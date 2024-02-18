/* eslint-disable react-hooks/exhaustive-deps */
import './home.scss';
import Loading from "../../components/Loading";
import { routes, Table } from "../../types/types";
import TableCard from "../../components/TableCard/TableCard";
import { GetTables } from "../../graphql/queries/tableQueries";
import { CHANGE_TABLE_STATUS } from "../../graphql/subscriptions/table";

import React, { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Table[] | null>(null);

  useQuery(GetTables, {
    onCompleted: (res) => {
      const data = res.tables;
      setData(data as Table[]);
      setLoading(false);
    },
    onError: (err) => {
        console.error(err);
        setLoading(false);
    }
  });

  useSubscription(CHANGE_TABLE_STATUS, {
    onSubscriptionData: (res) => {
      const data = res.subscriptionData.data.ChangeTableStatus;
      setData(
        (data || []).map((table: any) => {
          return {
            ...table.data,
          } as Table;
        })
      );
    }
  });

  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = routes.find(page => page.route === location.pathname);
  const pageTitle = currentPage ? currentPage.title : 'Comanda digital';

  const orderDataString = localStorage.getItem('orderData');
  const orderData = orderDataString ? JSON.parse(orderDataString) : '';
  orderData && orderData !== '' && navigate('/queue');

  return (
    <>
      {loading 
      ? (<Loading title="Aguarde, carregando mesas..." />) 
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
              && (
                data.map((table: any) => (
                  <TableCard 
                    key={table.id} 
                    id={table.id}
                    code={table.code}
                    state={table.state}
                  />
              )))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;