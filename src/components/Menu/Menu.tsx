import React, { useEffect, useState } from "react";
import './menu.scss';
import Card from "../Card/Card";
import Item from "../Item/Item";
import Loading from "../Loading";

import { useLazyQuery } from '@apollo/client';
import { GetCategories } from '../../graphql/queries/categoryQueries';
import { GetProducts } from '../../graphql/queries/productQueries';

function Menu() {
    const [getCategories, { data: categoryData }] = useLazyQuery(GetCategories);
    const [getProducts, { data: productData }] = useLazyQuery(GetProducts);
    const [loading, setLoading] = useState(true);
    const [categoryIds, setCategoryIds] = useState<[Number] | never[]>([]);

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
    
        if (categoryIds.length > 0) {
          fetchProducts();
        }
      }, [getProducts, productData, categoryIds]);

    return (
        <>  
            { loading 
            ? ( <Loading /> ) 
            : (
                <div className="cards-container">
                    { !categoryData
                    ? null
                    : categoryData.categories.map((category: any) => (
                        <Card key={category.id} title={category.name}>
                            <div className="item-container">
                            {   productData &&
                                productData.products &&
                                productData.products
                                .filter((product: any) => product.idCategory === category.id)
                                .map((filteredProduct: any) => (
                                    <Item
                                        key={filteredProduct.id}
                                        title={filteredProduct.name}
                                        price={filteredProduct.price}
                                        description={filteredProduct.description}
                                    />
                                )
                            )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}

export default Menu;