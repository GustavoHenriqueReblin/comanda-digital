import Home from './Home/Home';
import Menu from "./Menu/Menu";
import Queue from "./Queue/Queue";
import Header from "../components/Header/Header";
import ResponsiveProvider from "../components/ResponsiveProvider";

import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
 
function App() {
  return (
    <BrowserRouter>
      <ResponsiveProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ResponsiveProvider>
    </BrowserRouter>
  );
}

export default App;
