import React, { useState } from 'react'
import './TrackOrderPage.css'

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)
    setOrderData(null)

    if (!orderId.trim()) {
      setError('Please enter an order ID')
      return
    }

    try {
      setLoading(true)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
      
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found. Please check your order ID.')
        } else {
          setError(`Error: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      setOrderData(data)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to fetch order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered']
  const currentStepIndex = statusSteps.indexOf(orderData?.status)

  return (
    <div className="track-order-container">
      <div className="track-order-card">
        <h1>Track Your Order</h1>
        <p className="subtitle">Enter your order ID to check the status of your order</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Order ID (e.g., 123)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="order-id-input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && <div className="error-box">{error}</div>}

        {orderData && (
          <div className="order-details">
            <div className="order-header">
              <h2>Order #{orderData.id}</h2>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(orderData.status) }}>
                {getStatusLabel(orderData.status)}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Order Date:</span>
                <strong>{new Date(orderData.order_date).toLocaleDateString()}</strong>
              </div>
              <div className="summary-row">
                <span>Total Amount:</span>
                <strong>Rs {parseFloat(orderData.total_amount).toFixed(2)}</strong>
              </div>
              {orderData.shipping_address && (
                <div className="summary-row">
                  <span>Shipping Address:</span>
                  <strong>{orderData.shipping_address}</strong>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="progress-timeline">
              <h3>Delivery Status</h3>
              <div className="timeline">
                {statusSteps.map((step, index) => (
                  <div key={step} className="timeline-item">
                    <div
                      className={`timeline-dot ${
                        index <= currentStepIndex ? 'completed' : ''
                      }`}
                      style={{
                        backgroundColor:
                          index <= currentStepIndex ? getStatusColor(orderData.status) : '#ddd',
                      }}
                    ></div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className="timeline-line"
                        style={{
                          backgroundColor:
                            index < currentStepIndex ? getStatusColor(orderData.status) : '#ddd',
                        }}
                      ></div>
                    )}
                    <div className="timeline-label">{getStatusLabel(step)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="order-items">
                <h3>Items in This Order</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>Rs {parseFloat(item.price_at_purchase).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          Rs {(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="order-footer">
              <p className="help-text">
                Questions? <a href="/contact-us">Contact us</a> for more information about your order.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage
