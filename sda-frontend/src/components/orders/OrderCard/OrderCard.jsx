import React from 'react'
import './OrderCard.css'

function OrderCard({ order, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  // Normalize payment verification status to one of: approved, rejected, waiting
  const normalizeVerification = (val) => {
    if (!val) return 'waiting'
    const v = String(val).toLowerCase()
    if (v.includes('approve')) return 'approved'
    if (v.includes('reject')) return 'rejected'
    if (v.includes('waiting') || v.includes('admin')) return 'waiting'
    if (v === 'approved' || v === 'approved_by_admin' || v === 'ok') return 'approved'
    if (v === 'rejected' || v === 'declined') return 'rejected'
    return 'waiting'
  }

  const getVerificationColor = (status) => {
    const map = {
      approved: '#10b981',
      rejected: '#ef4444',
      waiting: '#f59e0b',
    }
    return map[status] || '#999'
  }

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-card-header">
        <div className="order-id">Order #{order.id}</div>
        {/* show payment verification status instead of order status */}
        {(() => {
          const raw = order.payment_verification_status ?? order.payment_status ?? order.status
          const v = normalizeVerification(raw)
          return (
            <div
              className={`order-status verification-${v}`}
              style={{ backgroundColor: getVerificationColor(v), color: '#fff' }}
            >
              {v === 'waiting' ? 'Waiting for Admin Approval' : v === 'approved' ? 'Approved' : 'Rejected'}
            </div>
          )
        })()}
      </div>

      <div className="order-card-body">
        <div className="order-info-row">
          <span className="label">Date:</span>
          <span className="value">{formatDate(order.order_date)}</span>
        </div>
        <div className="order-info-row">
          <span className="label">Total:</span>
          <span className="value">Rs {parseFloat(order.total_amount || 0).toFixed(2)}</span>
        </div>
        <div className="order-info-row">
          <span className="label">Items:</span>
          <span className="value">{order.items?.length || 0}</span>
        </div>

        <div className="order-info-row">
          <span className="label">Payment Verification:</span>
          <span className={`value verification-${normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '')}`}>
            {(() => {
              const raw = order.payment_verification_status ?? order.payment_status ?? ''
              const v = normalizeVerification(raw)
              return v === 'waiting' ? 'Waiting for Admin Approval' : v === 'approved' ? 'Approved' : 'Rejected'
            })()}
          </span>
        </div>

        <div className="order-info-row">
          <span className="label">Track Status:</span>
          <span className={`value track-${(order.track_order_status || order.track_status || (normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '') === 'approved' ? 'shipping' : '-')).toString().toLowerCase().replace(/\s+/g,'-')}`}>
            {(order.track_order_status || order.track_status) ? (order.track_order_status || order.track_status) : (normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '') === 'approved' ? 'shipping' : '-')}
          </span>
        </div>
      </div>

      <div className="order-card-footer">
        <button className={`btn-view btn-${normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '')}`}>
          View Details
        </button>
      </div>
    </div>
  )
}

export default OrderCard
