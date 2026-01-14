import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../services/AuthService'
import orderApi from '../../services/orderApi'
import OrderItem from '../../components/orders/OrderItem/OrderItem'
import ConfirmDialog from '../../components/orders/ConfirmDialog/ConfirmDialog'
import './OrderDetailsPage.css'

function OrderDetailsPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await orderApi.fetchOrder(orderId)
        setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err.response?.data?.detail || 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, isAuthenticated, navigate])

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true)
      await orderApi.cancelOrder(orderId)
      setSuccessMessage('Order cancelled successfully')
      setShowCancelDialog(false)
      setTimeout(() => {
        navigate('/order-history')
      }, 1500)
    } catch (err) {
      console.error('Error cancelling order:', err)
      setError(err.response?.data?.detail || 'Failed to cancel order')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestRefund = async () => {
    try {
      setActionLoading(true)
      await orderApi.requestRefund(orderId)
      setSuccessMessage('Refund requested successfully')
      setShowRefundDialog(false)
      setTimeout(() => {
        const fetchUpdatedOrder = async () => {
          const data = await orderApi.fetchOrder(orderId)
          setOrder(data)
        }
        fetchUpdatedOrder()
      }, 1500)
    } catch (err) {
      console.error('Error requesting refund:', err)
      setError(err.response?.data?.detail || 'Failed to request refund')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      shipped: '#2196f3',
      delivered: '#4caf50',
      cancelled: '#f44336',
      refunded: '#9c27b0',
    }
    return colors[status?.toLowerCase()] || '#999'
  }

  if (!isAuthenticated) {
    return (
      <div className="order-details-container">
        <h1>Order Details</h1>
        <p className="error-message">Please login to view order details</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="order-details-container">
        <h1>Order Details</h1>
        <p className="loading-message">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-details-container">
        <h1>Order Details</h1>
        <div className="error-message">{error}</div>
        <button className="btn-back" onClick={() => navigate('/order-history')}>
          Back to Orders
        </button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <h1>Order Details</h1>
        <p className="error-message">Order not found</p>
        <button className="btn-back" onClick={() => navigate('/order-history')}>
          Back to Orders
        </button>
      </div>
    )
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status?.toLowerCase())
  const canRefund = ['delivered', 'shipped'].includes(order.status?.toLowerCase()) && order.payment_status?.toLowerCase() !== 'refunded'

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <div>
          <h1>Order #{order.id}</h1>
          <p className="order-date">{formatDate(order.order_date)}</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/order-history')}>
          ← Back
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="order-details-grid">
        {/* Left: Order Info & Items */}
        <div className="order-section">
          <div className="status-card">
            <h3>Order Status</h3>
            <div className="status-badge" style={{ borderColor: getStatusColor(order.status) }}>
              <span className="status-dot" style={{ backgroundColor: getStatusColor(order.status) }}></span>
              <span>{order.status}</span>
            </div>
            <p className="status-label">Payment Status: <strong>{order.payment_status}</strong></p>
          </div>

          <div className="items-section">
            <h3>Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="items-list">
                {order.items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="no-items">No items in this order</p>
            )}
          </div>
        </div>

        {/* Right: Summary & Actions */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span className="label">Subtotal:</span>
            <span className="value">Rs {parseFloat(order.subtotal || order.total_amount).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="label">Shipping:</span>
            <span className="value">{order.shipping_cost ? `Rs ${parseFloat(order.shipping_cost).toFixed(2)}` : 'Free'}</span>
          </div>
          <div className="summary-row">
            <span className="label">Tax:</span>
            <span className="value">Rs 0</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span className="label">Total Amount:</span>
            <span className="value">Rs {parseFloat(order.total_amount).toFixed(2)}</span>
          </div>

          <div className="order-meta">
            <div className="meta-row">
              <span className="label">Delivery Address:</span>
              <span className="value">{order.shipping_address || 'N/A'}</span>
            </div>
            <div className="meta-row">
              <span className="label">Phone:</span>
              <span className="value">{order.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="action-buttons">
            {canCancel && (
              <button
                className="btn-danger"
                onClick={() => setShowCancelDialog(true)}
                disabled={actionLoading}
              >
                Cancel Order
              </button>
            )}
            {canRefund && (
              <button
                className="btn-warning"
                onClick={() => setShowRefundDialog(true)}
                disabled={actionLoading}
              >
                Request Refund
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={showRefundDialog}
        title="Request Refund"
        message="Are you sure you want to request a refund for this order?"
        confirmText="Yes, Request Refund"
        cancelText="Cancel"
        onConfirm={handleRequestRefund}
        onCancel={() => setShowRefundDialog(false)}
        isDangerous={false}
      />
    </div>
  )
}

export default OrderDetailsPage
