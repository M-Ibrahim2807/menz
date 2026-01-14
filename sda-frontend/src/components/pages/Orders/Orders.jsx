import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Orders.css'

function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(Array.isArray(data) ? data : data.results || [])
        setLoading(false)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        setError('Failed to load orders')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Error loading orders')
      setLoading(false)
    }
  }

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  if (loading) {
    return (
      <div className="orders-container">
        <h1>Your Orders</h1>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track the status of all your orders</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button 
            className="btn-continue-shopping"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                  {order.status || 'Pending'}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-detail">
                  <label>Total Amount:</label>
                  <span className="order-amount">
                    PKR {order.total_price ? parseFloat(order.total_price).toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="order-detail">
                  <label>Items:</label>
                  <span>{order.items?.length || 0} item(s)</span>
                </div>

                <div className="order-detail">
                  <label>Delivery Status:</label>
                  <div className="status-timeline">
                    <div className={`status-step ${['delivered', 'shipped', 'processing', 'pending'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                      <div className="status-circle"></div>
                      <span>Order Placed</span>
                    </div>
                    <div className={`status-step ${['delivered', 'shipped', 'processing'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                      <div className="status-circle"></div>
                      <span>Processing</span>
                    </div>
                    <div className={`status-step ${['delivered', 'shipped'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                      <div className="status-circle"></div>
                      <span>Shipped</span>
                    </div>
                    <div className={`status-step ${order.status?.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                      <div className="status-circle"></div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <button 
                  className="btn-view-details"
                  onClick={() => handleViewOrder(order.id)}
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
