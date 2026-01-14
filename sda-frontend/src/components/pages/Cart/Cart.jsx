import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { apiClient, API_ENDPOINTS } from '../../../services/api'
import { AuthContext } from '../../../services/AuthService'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please login to view your cart')
      setLoading(false)
      return
    }

    const fetchCart = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.get(API_ENDPOINTS.CART.LIST)
        console.log('Cart data:', data)
        setCart(data)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Failed to load cart')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()

    // Check if returning from successful order placement
    if (location.state?.orderId) {
      fetchOrderStatus(location.state.orderId)
    }
  }, [isAuthenticated, location])

  const fetchOrderStatus = async (orderId) => {
    try {
      setOrderLoading(true)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`)
      
      if (response.ok) {
        const data = await response.json()
        setOrderStatus(data)
      }
    } catch (err) {
      console.error('Error fetching order status:', err)
    } finally {
      setOrderLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await apiClient.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`)
      // Refresh cart
      const data = await apiClient.get(API_ENDPOINTS.CART.LIST)
      setCart(data)
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Failed to remove item')
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    try {
      await apiClient.put(`http://127.0.0.1:8000/api/cart/update/${itemId}/`, { quantity: newQuantity })
      const data = await apiClient.get(API_ENDPOINTS.CART.LIST)
      setCart(data)
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('Failed to update quantity')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="error-text">{error}</p>
        <Link to="/login" className="link-button">Go to Login</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="loading-text">Loading cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="error-text">{error}</p>
      </div>
    )
  }

  // Show Order Status if available
  if (orderStatus) {
    const getStatusColor = (status) => {
      const colors = {
        pending: '#ffc107',
        paid: '#17a2b8',
        processing: '#007bff',
        shipped: '#20c997',
        delivered: '#28a745',
        cancelled: '#dc3545',
        refunded: '#6c757d',
      }
      return colors[status] || '#6c757d'
    }

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'Pending Payment',
        paid: 'Payment Received',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
      }
      return labels[status] || status
    }

    return (
      <div className="cart-container">
        <div className="order-status-container">
          <h1>Order Placed Successfully!</h1>
          
          <div className="order-status-card">
            <div className="order-header">
              <h2>Order #{orderStatus.id}</h2>
              <div 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(orderStatus.status) }}
              >
                {getStatusLabel(orderStatus.status)}
              </div>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span className="value">{new Date(orderStatus.order_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Amount:</span>
                <span className="value">Rs {parseFloat(orderStatus.total_amount).toFixed(2)}</span>
              </div>
              {orderStatus.shipping_address && (
                <div className="detail-row">
                  <span className="label">Shipping Address:</span>
                  <span className="value">{orderStatus.shipping_address}</span>
                </div>
              )}
            </div>

            {orderStatus.items && orderStatus.items.length > 0 && (
              <div className="order-items-section">
                <h3>Items in Your Order</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderStatus.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>Rs {parseFloat(item.price_at_purchase).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>Rs {(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="order-actions">
              <button 
                className="btn-continue-shopping"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
              <button 
                className="btn-view-orders"
                onClick={() => navigate('/order-history')}
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="empty-text">Your cart is empty</p>
        <Link to="/" className="link-button">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        {/* Left: Products Table */}
        <div className="cart-items">
          <h1>Shopping Cart</h1>
          <div className="cart-table">
            <div className="table-header">
              <div className="col-product">Product</div>
              <div className="col-name">Name</div>
              <div className="col-amount">Amount</div>
              <div className="col-type">Type</div>
              <div className="col-actions">Actions</div>
            </div>
            {cart.items.map((item) => (
              <div key={item.id} className="table-row">
                <div className="col-product">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="col-name">{item.product.name}</div>
                <div className="col-amount">Rs {parseFloat(item.product.price).toFixed(0)}</div>
                <div className="col-type">{item.product.category || 'Product'}</div>
                <div className="col-actions">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn minus"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      className="qty-btn plus"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span className="label">Payable Amount</span>
            <span className="value">Rs {parseFloat(cart.total).toFixed(0)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Tax</span>
            <span className="value">Rs 0</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item total">
            <span className="label">Order Total</span>
            <span className="value">Rs {parseFloat(cart.total).toFixed(0)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate('/orders/upload-payment', { state: { cart, total: parseFloat(cart.total).toFixed(0) } })}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
