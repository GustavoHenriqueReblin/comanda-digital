import React from "react";
import Header from "../../components/Header/Header";
import ResponsiveProvider from '../../components/ResponsiveProvider';
import Menu from "../../components/Menu/Menu";

function Home() {
  return (
    <>
      <ResponsiveProvider>
        <Header />
        <Menu />
      </ResponsiveProvider>
    </>
  );
}

export default Home;