import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from './Login/Login';
import Home from './Home/Home';
 
function App() {
  const PrivateRoute = ({ children, redirectTo }) => {
    const isAuthenticated = !!(Cookies.get(process.env.REACT_APP_COOKIE_NAME_USER_TOKEN));
    return isAuthenticated ? children : <Navigate to={redirectTo} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/home' element={
            <PrivateRoute redirectTo="/login">
              <Home />
            </PrivateRoute>
          } 
        />
        <Route path='/login' element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
