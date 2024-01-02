import React from "react";
import Card from "../components/Card/Card";
import Header from "../components/Header/Header";
import Item from "../components/Item/Item";
import ResponsiveProvider from '../components/ResponsiveProvider';
import './home.scss';

function Home() {
  return (
    <>
      <ResponsiveProvider>
        <Header />

        <div className="cards-container">
          <Card title="Lanches">
            <div className="item-container">
              <Item 
                title="X-Burguer"
                price="10,00"
                description="Caçador de estrelas em noites serenas."
              ></Item>
              <Item 
                title="X-Expecial"
                price="12,00"
                description="Dançarino de palavras, criando poesia nos espaços em branco."
              ></Item>
              <Item 
                title="X-Salada"
                price="16,00"
                description="Cenoura, rúcula e brócolis"
              ></Item>
              <Item 
                title="X-Frango"
                price="8,00"
                description="Arquiteto de risos, construindo pontes de alegria."
              ></Item>
            </div>
          </Card>

          <Card title="Bebidas">
            <div className="item-container">
              <Item 
                title="Coca-cola 600ml"
                price="11,50"
                description="Caçador de estrelas em noites serenas."
              ></Item>
              <Item 
                title="Cerveja Heineken 700ml"
                price="16,00"
                description="Dançarino de palavras, criando poesia nos espaços em branco."
              ></Item>
              <Item 
                title="Suco de laranja 800ml"
                price="19,99"
                description="Cenoura, rúcula e brócolis"
              ></Item>
              <Item 
                title="Água"
                price="8,00"
                description="Arquiteto de risos, construindo pontes de alegria."
              ></Item>
            </div>
          </Card>
        </div>
      </ResponsiveProvider>
    </>
  );
}
  
export default Home;