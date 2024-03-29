/* eslint-disable react-hooks/exhaustive-deps */
import './menu.scss';
import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Totalizer from "../../components/Totalizer/Totalizer";
import Category from '../../components/Category/Category';
import { Category as CategoryType, Product as ProductType, routes, Table } from "../../types/types";
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';
import { CHANGE_TABLE_STATUS } from "../../graphql/subscriptions/table";
import { UPDATE_TABLE } from "../../graphql/mutations/table";

import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { useSubscription } from "@apollo/client";
import { IoRefresh } from "react-icons/io5";
import Product from '../../components/Product/Product';

function Menu() {
  const [loading, setLoading] = useState(true);
  const [orderIsConfirmed, setOrderIsConfirmed] = useState<boolean | null>(null);
  const [categorySelected, setCategorySelected] = useState<CategoryType | null>(null);
  const [productsSelected, setProductsSelected] = useState<ProductType[] | null>(null);
  const [sessionTableSelected, setSessionTableSelected] = useState<string | null>(null);
  const [updateTable] = useMutation(UPDATE_TABLE);
  const [getProducts, { data: productsData }] = useLazyQuery(GetProducts, {
    onCompleted: () => {
      const localProductsIds = localStorage.getItem('productsSelected');
      const selectedProducts = localProductsIds ? JSON.parse(localProductsIds) : [];
      productsSelected !== null && setProductsSelected(selectedProducts);
    }
  });

  const { data: categoryData } = useQuery(GetCategories, {
    onCompleted: (res) => {
      const localCategory = localStorage.getItem('categorySelected');
      const category = localCategory ? JSON.parse(localCategory) : undefined;
      (category !== null && category !== undefined) && setCategorySelected(category);
      
      const categoryIds = res.categories.map((category: any) => Number(category.id));

      getProducts({ variables: { filter: { categoriesIds: categoryIds } } })
        .then(() => {
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

  const isProductSelected = (product: ProductType): boolean => {
    const selectedProducts = JSON.parse(localStorage.getItem('productsSelected') || '[]');
    return selectedProducts.some((item: ProductType) => item.id === product.id);
  };

  const handleProductClick = (product: ProductType) => {
    const selectedProducts = JSON.parse(localStorage.getItem('productsSelected') || '[]');
    const isSelected = isProductSelected(product);

    let updatedProducts = [];
    if (!isSelected) {
      updatedProducts = [...selectedProducts, product];
    } else {
      updatedProducts = selectedProducts.filter((item: ProductType) => item.id !== product.id);
    }

    setProductsSelected(updatedProducts);
    localStorage.setItem('productsSelected', JSON.stringify(updatedProducts));
  };

  useEffect(() => {
    const orderDataString = localStorage.getItem('orderData');
    const orderData = orderDataString ? JSON.parse(orderDataString) : '';
    orderIsConfirmed === null && setOrderIsConfirmed(!!orderData && orderData !== null);
    (orderData && orderData !== '') && navigate('/queue');

    const localTable = localStorage.getItem('tableSelected');
    localTable ? sessionTableSelected === null && setSessionTableSelected(localTable) : navigate('/');
  });

  return (
    <>  
      { loading 
      ? ( <Loading title="Aguarde, carregando cardápio..." /> ) 
      : (
          <>
            <Helmet>
              <title>{pageTitle}</title>
            </Helmet>
            
            <div className="main">
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
              <div className='category-area'>
                <Category 
                  isSelected={categorySelected === null} 
                  data={null} 
                  onClick={() => {
                    localStorage.setItem('categorySelected', 'null');
                    setCategorySelected(null);
                  }}
                />
                { categoryData && categoryData !== null && 
                  categoryData.categories.map((category: CategoryType) => (
                    <Category 
                      key={category.id}
                      isSelected={categorySelected !== undefined && categorySelected?.id === category.id} 
                      data={category} 
                      onClick={(category) => {
                        localStorage.setItem('categorySelected', JSON.stringify(category))
                        setCategorySelected(category);
                      }}
                    />
                ))}
              </div>
              
              <div className='product-area'>
                { productsData && productsData !== null && categorySelected !== null 
                  ? productsData.products
                      .filter((product: ProductType) => Number(product.idCategory) === Number(categorySelected?.id))
                      .map((product: ProductType) => (
                        <Product 
                          key={product.id}
                          isSelected={isProductSelected(product)}
                          data={product}
                          onClick={(prod) => handleProductClick(prod)}
                        />
                    )) 
                  : productsData.products
                      .map((product: ProductType) => (
                        <Product 
                          key={product.id}
                          isSelected={isProductSelected(product)}
                          data={product}
                          onClick={(prod) => handleProductClick(prod)}
                        />
                    ))
                  }
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
                const totalPrice = selectedProducts.reduce((sumAux: number, product: ProductType) => sumAux + product.price, 0);
                return `${totalPrice.toFixed(2)}`;
              }} 
              hasOrderConfirmed={orderIsConfirmed} 
            />
          </>
      )}
    </>
  )
}

export default Menu;