import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
// import Cookies from 'js-cookie';
// import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
// import Admin from './pages/Admin/Admin';
import Header from "./components/Header/Header";
import ResponsiveProvider from "./components/ResponsiveProvider";

// interface PrivateRouteProps {
//   children: React.ReactNode;
//   redirectTo: string;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectTo }) => {
//   const cookieName = process.env.REACT_APP_COOKIE_NAME_USER_TOKEN;
//   const isAuthenticated = !!(Cookies.get(cookieName ? cookieName : ''));
//   return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
// }
 
function App() {
  return (
    <BrowserRouter>
      <ResponsiveProvider>
        <Header />
        <Routes>
          {/* <Route 
            path='/admin' element={
              <PrivateRoute redirectTo="/login">
                <Admin />
              </PrivateRoute>
            } 
          />
          <Route path='/login' element={<Login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ResponsiveProvider>
    </BrowserRouter>
  );
}

export default App;
