import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from './Login/Login';
import Home from './Home/Home';
 
function App() {
  const PrivateRoute = ({ children, redirectTo }) => {
    const isAuthenticated = false;
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
