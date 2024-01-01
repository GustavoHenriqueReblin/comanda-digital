import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from './Login/Login';
import Home from './Home/Home';
import Admin from './Admin/Admin';
 
function App() {
  const PrivateRoute = ({ children, redirectTo }) => {
    const isAuthenticated = !!(Cookies.get(process.env.REACT_APP_COOKIE_NAME_USER_TOKEN));
    return isAuthenticated ? children : <Navigate to={redirectTo} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/admin' element={
            <PrivateRoute redirectTo="/login">
              <Admin />
            </PrivateRoute>
          } 
        />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
