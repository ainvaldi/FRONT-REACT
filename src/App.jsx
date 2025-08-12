import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './layouts/home/index';

import ProductRoutes from './layouts/products/index';
import { ProductProvider } from './context/ProductContext';

import UserRoutes from './layouts/users/index';
import { UserProvider } from './context/UserContext'

import { AuthProvider } from './context/AuthContext';
import LoginForm from './layouts/auth/LoginForm';
import RegisterForm from './layouts/auth/RegisterForm';

import PrivateRoute from './utils/PrivateRoute';

import './App.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <Router>
        <AuthProvider>
          <Fragment>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/inicio-sesion' element={<LoginForm/>}/>
              <Route path='/registro' element={<RegisterForm/>}/>
              <Route
                path="/productos/*"
                element={
                  <PrivateRoute>
                    <ProductProvider>
                      <ProductRoutes />
                    </ProductProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/*"
                element={
                  <UserProvider>
                    <UserRoutes />
                  </UserProvider>
                }
              />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
  );
}

export default App;
