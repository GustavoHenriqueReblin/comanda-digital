import React from "react";
import Card from "../components/Card/Card";
import Header from "../components/Header/Header";
import ResponsiveProvider from '../components/ResponsiveProvider';
import './home.scss';

function Home() {
  return (
    <>
      <ResponsiveProvider>
        <Header />

        <div className="cards">
          <Card title="Bebidas">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
        </div>
      </ResponsiveProvider>
    </>
  );
}
  
export default Home;