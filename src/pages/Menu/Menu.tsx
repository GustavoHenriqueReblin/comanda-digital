/* eslint-disable react-hooks/exhaustive-deps */
import './menu.scss';
import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Item from "../../components/Item/Item";
import Loading from "../../components/Loading";
import Totalizer from "../../components/Totalizer/Totalizer";
import { RememberContext } from "../../contexts/remember";
import { Category, Order, Product, Redirect, routeTitles, Table } from "../../types/types";
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';
import { CHANGE_TABLE_STATUS } from "../../graphql/subscriptions/table";

import { useLazyQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoRefresh } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useSubscription } from "@apollo/client";

function Menu() {
  const { data: tableStatusData } = useSubscription(CHANGE_TABLE_STATUS);
  const [getCategories, { data: categoryData }] = useLazyQuery(GetCategories);
  const [getProducts, { data: productData }] = useLazyQuery(GetProducts);
  const [loading, setLoading] = useState(true);
  const [orderIsConfirmed, setOrderIsConfirmed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Usado como filtro para buscar apenas produtos com categorias vinculadas.
  const [categoryIds, setCategoryIds] = useState<[number] | null>(null);
  const [categoryExpandedIds, setCategoryExpandedIds] = useState<[number] | null>(null);
  const [productsSelected, setProductsSelected] = useState<Product[] | null>(null);
  const [resetProducts, setResetProducts] = useState<boolean>(false);
  const [sessionTableSelected, setSessionTableSelected] = useState<string | null>(null);

  const redirectTo = (typeRedirect: Redirect) => {
    if (typeRedirect === Redirect.ROOT) {
      navigate('/')
    }
  };

  const pageTitle = routeTitles[location.pathname] || 'Comanda digital';

  useEffect(() => {
    const orderDataString = localStorage.getItem('orderData');
    const orderData = orderDataString ? JSON.parse(orderDataString) : '';
    if (orderData && orderData !== '') {
      navigate('/queue');
    }

    const fetchCategories = async () => {
      try {
        if (!categoryData) {
          const result = await getCategories();
          if (result.data && result.data.categories) {
            const ids = result.data.categories.map((category: any) => Number(category.id));
            setCategoryIds(ids);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    };

    // Mostra o menu apenas com a mesa selecionada
    const verifyTable = localStorage.getItem('tableSelected');
    verifyTable ? setSessionTableSelected(verifyTable) : navigate('/');
    
    fetchCategories();
  }, [getCategories, categoryData, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!productData) {
          await getProducts({ variables: { filter: { categoriesIds: categoryIds } } });
        }
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (categoryIds && categoryIds.length > 0) {
      fetchProducts();
      const orderDataString = localStorage.getItem('orderData');
      const orderData = orderDataString ? JSON.parse(orderDataString) : '';
      setOrderIsConfirmed(!!orderData && orderData !== null);
    }
  }, [getProducts, productData, categoryIds]);

  useEffect(() => { 
    if (tableStatusData) {
      const tableSelectedString = localStorage.getItem('tableSelected');
      const tableSelected = tableSelectedString ? JSON.parse(tableSelectedString) : '';
      const expiredTable = tableStatusData.ChangeTableStatus.find((table: any) => (table.data as Table).id === tableSelected.id);

      if (!!expiredTable && expiredTable.data.state) { // Caso a mesa selecionada tenha sido atualizada para livre, redireciona
        navigate('/');
      }
    }    
    setLoading(false); 
  }, [tableStatusData]);

  useEffect(() => {
    const localCategoryIds = localStorage.getItem('categoryExpandedIds');
    const categoryIds = localCategoryIds ? JSON.parse(localCategoryIds) : [];
    setCategoryExpandedIds(categoryIds);

    const localProductsIds = localStorage.getItem('productsSelected');
    const selectedProducts = localProductsIds ? JSON.parse(localProductsIds) : [];
    setProductsSelected(selectedProducts);
  }, []);

  return (
    <>  
      { loading 
      ? ( <Loading title="Aguarde, carregando cardápio..." /> ) 
      : (
          <RememberContext.Provider value={
            { setCategoryExpandedIds, setProductsSelected, resetProducts, setResetProducts }
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
                  <span className="change-table" onClick={() => redirectTo(Redirect.ROOT)}>
                    <IoRefresh /> &nbsp; Trocar de mesa
                  </span>
                )}
              </div>
              { !categoryData
              ? null
              : categoryData.categories.map((category: Category) => (
                  <CategoryCard 
                    id={category.id}
                    key={category.id} 
                    title={category.name}
                    isExpandedByUser={() => {
                      return categoryExpandedIds?.includes(category.id);
                    }}
                  >
                    <div className="item-container">
                      { productData &&
                        productData.products &&
                        productData.products
                        .filter((product: Product) => product.idCategory === category.id)
                        .map((filteredProduct: Product) => (
                            <Item
                              key={filteredProduct.id}
                              id={filteredProduct.id}
                              title={filteredProduct.name}
                              price={filteredProduct.price}
                              description={filteredProduct.description}
                              isSelectedByUser={() => {
                                return productsSelected?.some((product: Product) => product.id === Number(filteredProduct.id)) ?? false;
                              }} 
                              hasOrderConfirmed={orderIsConfirmed}                                       
                            />
                        )
                      )}
                    </div>
                  </CategoryCard>
              ))}
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