import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../services/AuthService'
import orderApi from '../../services/orderApi'
import OrderCard from '../../components/orders/OrderCard/OrderCard'
import './OrderHistoryPage.css'

function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await orderApi.fetchOrderHistory()
        setOrders(Array.isArray(data) ? data : data.orders || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err.response?.data?.detail || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, navigate])

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  if (!isAuthenticated) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <p className="error-message">Please login to view your orders</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <p className="loading-message">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <div className="empty-state">
          <p>No orders found</p>
          <button
            className="btn-shop"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      <div className="orders-grid">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => handleOrderClick(order.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default OrderHistoryPage
