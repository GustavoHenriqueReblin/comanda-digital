/* eslint-disable react-hooks/exhaustive-deps */
import './menu.scss';
import React, { useState } from "react";
import Loading from "../../components/Loading";
import Totalizer from "../../components/Totalizer/Totalizer";
import { RememberContext } from "../../contexts/remember";
import { Category, Product, routes, Table } from "../../types/types";
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';
import { CHANGE_TABLE_STATUS } from "../../graphql/subscriptions/table";
import { UPDATE_TABLE } from "../../graphql/mutations/table";

import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoRefresh } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useSubscription } from "@apollo/client";

function Menu() {
  const [loading, setLoading] = useState(true);
  const [orderIsConfirmed, setOrderIsConfirmed] = useState<boolean | null>(null);
  const [categoriesExpanded, setCategoriesExpanded] = useState<Category[] | null>(null);
  const [productsSelected, setProductsSelected] = useState<Product[] | null>(null);
  const [resetProducts, setResetProducts] = useState<boolean>(false);
  const [sessionTableSelected, setSessionTableSelected] = useState<string | null>(null);
  const [updateTable] = useMutation(UPDATE_TABLE);
  const [getProducts, { data: productsData }] = useLazyQuery(GetProducts);

  const { data: categoryData } = useQuery(GetCategories, {
    onCompleted: (res) => {
      const categoryIds = res.categories.map((category: any) => Number(category.id));

      getProducts({ variables: { filter: { categoriesIds: categoryIds } } })
        .then((res) => {
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Erro ao buscar os produtos: ", error);
          setLoading(false); 
        });
    },
    onError: (error) => {
      console.error("Erro ao buscar as categorias: ", error);
      setLoading(false);
    }
  });

  useSubscription(CHANGE_TABLE_STATUS, {
    onSubscriptionData: (res) => {
      const tableSelectedString = localStorage.getItem('tableSelected');
      const tableSelected = tableSelectedString ? JSON.parse(tableSelectedString) : '';
      const expiredTable = res.subscriptionData.data.ChangeTableStatus.find((table: any) => (table.data as Table).id === tableSelected.id);

      if (!!expiredTable && expiredTable.data.state) { // Caso a mesa selecionada tenha sido atualizada para livre, redireciona
        navigate('/');
      }
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = routes.find(page => page.route === location.pathname);
  const pageTitle = currentPage ? currentPage.title : 'Comanda digital';

  const updateTableSelected = async () => {
    try {
      const tableString = localStorage.getItem('tableSelected');
      
      if (tableString !== null) {
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
          .then(() => {
            localStorage.removeItem('tableSelected');
            navigate('/');
          });
      }
    } catch (error) {
      console.error("Erro ao atualizar a mesa selecionada anteriormente: ", error);
    }
  };

  const localCategories = localStorage.getItem('categoriesExpanded');
  const categories = localCategories ? JSON.parse(localCategories) : [];
  categoriesExpanded === null && setCategoriesExpanded(categories);

  const localProductsIds = localStorage.getItem('productsSelected');
  const selectedProducts = localProductsIds ? JSON.parse(localProductsIds) : [];
  productsSelected === null && setProductsSelected(selectedProducts);

  const orderDataString = localStorage.getItem('orderData');
  const orderData = orderDataString ? JSON.parse(orderDataString) : '';
  orderIsConfirmed === null && setOrderIsConfirmed(!!orderData && orderData !== null);
  (orderData && orderData !== '') && navigate('/queue');

  return (
    <>  
      { loading 
      ? ( <Loading title="Aguarde, carregando cardápio..." /> ) 
      : (
          <RememberContext.Provider value={
            { setCategoriesExpanded, setProductsSelected, resetProducts, setResetProducts }
          }>
            <Helmet>
              <title>{pageTitle}</title>
            </Helmet>
            
            <div className="cards-container">
              <div className="table-info">
                <h2 className="table-title">
                  Número da sua mesa:&nbsp;
                  {sessionTableSelected ? JSON.parse(sessionTableSelected).code : ''}
                </h2>
                { !orderIsConfirmed && (
                  <span className="change-table" onClick={() => updateTableSelected()}>
                    <IoRefresh /> &nbsp; Trocar de mesa
                  </span>
                )}
              </div>
            </div>

            <Totalizer 
              isVisible={() => {
                const sessionIds = localStorage.getItem('productsSelected');
                const ids = sessionIds ? JSON.parse(sessionIds) : [];
                return ids && !!(ids.length > 0);
              }} 
              total={() => {
                const sessionProducts = localStorage.getItem('productsSelected');
                const selectedProducts = sessionProducts ? JSON.parse(sessionProducts) : [];
                const totalPrice = selectedProducts.reduce((sumAux: number, product: Product) => sumAux + product.price, 0);
                return `${totalPrice.toFixed(2)}`;
              }} 
              hasOrderConfirmed={orderIsConfirmed} 
            />
          </RememberContext.Provider>
      )}
    </>
  )
}

export default Menu;