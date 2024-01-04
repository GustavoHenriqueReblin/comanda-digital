import React, { useEffect, useState } from "react";
import './menu.scss';
import Card from "../Card/Card";
import Item from "../Item/Item";
import Loading from "../Loading";
import Totalizer from "../Totalizer/Totalizer";

import { Product } from "../../types/types";
import { RememberContext } from "../../contexts/remember";
import { useLazyQuery } from '@apollo/client';
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';

function Menu() {
    const [getCategories, { data: categoryData }] = useLazyQuery(GetCategories);
    const [getProducts, { data: productData }] = useLazyQuery(GetProducts);
    const [loading, setLoading] = useState(true);

    // Usado como filtro para buscar apenas produtos com categorias vinculadas.
    const [categoryIds, setCategoryIds] = useState<[number] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_categoryExpandedIds, setCategoryExpandedIds] = useState<[number] | []>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_productsSelected, setProductsSelected] = useState<Product[] | []>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [resetProducts, setResetProducts] = useState<boolean>(false);

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
  
      fetchCategories();
    }, [getCategories, categoryData]);
  
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
                      { !categoryData
                      ? null
                      : categoryData.categories.map((category: any) => (
                          <Card 
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
                          </Card>
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