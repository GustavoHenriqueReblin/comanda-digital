import React, { useEffect, useState } from "react";
import './menu.scss';
import CategoryCard from "../CategoryCard/CategoryCard";
import Item from "../Item/Item";
import Loading from "../Loading";
import Totalizer from "../Totalizer/Totalizer";

import { Product } from "../../types/types";
import { RememberContext } from "../../contexts/remember";
import { useLazyQuery } from '@apollo/client';
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const [getCategories, { data: categoryData }] = useLazyQuery(GetCategories);
    const [getProducts, { data: productData }] = useLazyQuery(GetProducts);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Usado como filtro para buscar apenas produtos com categorias vinculadas.
    const [categoryIds, setCategoryIds] = useState<[number] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_categoryExpandedIds, setCategoryExpandedIds] = useState<[number] | []>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_productsSelected, setProductsSelected] = useState<Product[] | []>([]);
    const [resetProducts, setResetProducts] = useState<boolean>(false);
    const [sessionTableSelected, setSessionTableSelected] = useState<string | null>(null);

    useEffect(() => {
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
      const verifyTable = sessionStorage.getItem('tableSelected');
      verifyTable ? setSessionTableSelected(verifyTable) : navigate('/');
      
      fetchCategories();
    }, [getCategories, categoryData, navigate]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          if (!productData) {
            await getProducts({ variables: { filter: { idCategory: categoryIds } } });
          }
        } catch (error) {
          console.error("Erro ao buscar os produtos:", error);
        } finally {
          setLoading(false); 
        }
      };
  
      if (categoryIds && categoryIds.length > 0) {
        fetchProducts();
      }
    }, [getProducts, productData, categoryIds]);

    return (
        <>  
            { loading 
            ? ( <Loading title="Aguarde, carregando cardápio..." /> ) 
            : (
                <RememberContext.Provider value={
                  { setCategoryExpandedIds, setProductsSelected, resetProducts, setResetProducts }
                }>
                  <div className="cards-container">
                    <h2 className="table-title">
                      Número da sua mesa:&nbsp;
                      {sessionTableSelected ? JSON.parse(sessionTableSelected).code : ''}
                    </h2>
                    { !categoryData
                    ? null
                    : categoryData.categories.map((category: any) => (
                        <CategoryCard 
                          id={category.id}
                          key={category.id} 
                          title={category.name}
                          isExpandedByUser={() => {
                            const sessionIds = sessionStorage.getItem('categoryExpandedIds');
                            const ids = sessionIds ? JSON.parse(sessionIds) : [];
                            setCategoryExpandedIds(ids);
                            return !!(ids.length > 0) && ids.includes(category.id); 
                          }}
                        >
                            <div className="item-container">
                            {   productData &&
                                productData.products &&
                                productData.products
                                .filter((product: any) => product.idCategory === category.id)
                                .map((filteredProduct: any) => (
                                    <Item
                                      key={filteredProduct.id}
                                      id={filteredProduct.id}
                                      title={filteredProduct.name}
                                      price={filteredProduct.price}
                                      description={filteredProduct.description}
                                      isSelectedByUser={() => {
                                        const sessionProducts = sessionStorage.getItem('productsSelected');
                                        const selectedProducts = sessionProducts ? JSON.parse(sessionProducts) : [];
                                        const foundProduct = selectedProducts.find((product: Product) => product.id === filteredProduct.id);
                                        setProductsSelected(selectedProducts);
                                        return (!!foundProduct);
                                      }}                                        
                                    />
                                )
                            )}
                            </div>
                        </CategoryCard>
                    ))}
                  </div>
                  <Totalizer 
                    isVisible={() => {
                      const sessionIds = sessionStorage.getItem('productsSelected');
                      const ids = sessionIds ? JSON.parse(sessionIds) : [];
                      return ids && !!(ids.length > 0);
                    }} 
                    total={() => {
                      const sessionProducts = sessionStorage.getItem('productsSelected');
                      const selectedProducts = sessionProducts ? JSON.parse(sessionProducts) : [];
                      const totalPrice = selectedProducts.reduce((sumAux: number, product: Product) => sumAux + product.price, 0);
                      return `${totalPrice.toFixed(2)}`;
                    }} 
                  />
                </RememberContext.Provider>
            )}
        </>
    )
}

export default Menu;