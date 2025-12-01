import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './services/AuthService';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import About from './components/pages/About';
import Cart from './components/pages/Cart';
import Wishlist from './components/pages/Wishlist';
import Orders from './components/pages/Orders';
import OrderDetail from './components/pages/OrderDetail';
import OrderHistory from './components/pages/OrderHistory';
import Profile from './components/pages/Profile';
import EditProfile from './components/pages/EditProfile';
import './style/global.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/category/:category" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/orders/history" element={<OrderHistory />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    );
  }
}

export default App;