import React from "react";
import Card from "../components/Card/Card";
import ResponsiveProvider from '../components/ResponsiveProvider';

function Home() {
  return (
    <>
      <ResponsiveProvider>
        <div className="cards">
          <Card title="Bebidas">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Lanches">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Pratos principais">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Sei lá">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Bebidas">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Lanches">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Pratos principais">
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
          </Card>
          <Card title="Sei lá">
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