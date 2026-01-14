import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './services/AuthService'
import Layout from './components/layout/Layout'
import Home from './components/pages/Home/Home'
import ProductList from './components/products/ProductList/ProductList'
import ProductDetail from './components/products/ProductDetail/ProductDetail'
import Search from './components/pages/Search/Search'
import Cart from './components/pages/Cart/Cart'
import Wishlist from './components/pages/Wishlist/Wishlist'
import Orders from './components/pages/Orders/Orders'
import OrderDetail from './components/pages/OrderDetail/OrderDetail'
import OrderHistory from './components/pages/OrderHistory/OrderHistory'
import Profile from './components/pages/Profile/Profile'
import EditProfile from './components/pages/EditProfile/EditProfile'
import About from './components/pages/About/About'
import Login from './components/auth/Login/Login'
import Register from './components/auth/Register/Register'
import PrivacyPolicy from './components/pages/PrivacyPolicy/PrivacyPolicy'
import TermsOfService from './components/pages/TermsOfService/TermsOfService'
import ContactUs from './components/pages/ContactUs/ContactUs'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage'
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage'
import OrderDebugPage from './pages/OrderDebugPage/OrderDebugPage'
import PaymentUploadPage from './pages/PaymentUploadPage/PaymentUploadPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/orders/debug" element={<OrderDebugPage />} />
            <Route path="/orders/upload-payment" element={<PaymentUploadPage />} />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
