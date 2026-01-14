import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrderHistory.css'

function OrderHistory() {
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

      const response = await fetch('http://localhost:8000/api/orders/history/', {
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

  const normalizeVerification = (val) => {
    if (!val) return 'waiting'
    const v = String(val).toLowerCase()
    if (v.includes('approve')) return 'approved'
    if (v.includes('reject')) return 'rejected'
    if (v.includes('waiting') || v.includes('admin')) return 'waiting'
    if (v === 'approved') return 'approved'
    return 'waiting'
  }

  if (loading) {
    return (
      <div className="order-history-container">
        <h1>Order History</h1>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>View all your past orders</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button 
            className="btn-continue-shopping"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Payment Verification</th>
                  <th>Track Status</th>
                  <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="order-total">Rs {order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</td>
                    <td>
                      {(() => {
                        const raw = order.payment_verification_status ?? order.payment_status ?? ''
                        const v = normalizeVerification(raw)
                        return (
                          <span className={`status-badge status-${v}`}>
                            {v === 'waiting' ? 'Waiting for Admin Approval' : v === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const raw = normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '')
                        const track = order.track_order_status ?? order.track_status ?? (raw === 'approved' ? 'shipping' : '-')
                        return <span className={`track-badge track-${track.toString().toLowerCase().replace(/\s+/g,'-')}`}>{track}</span>
                      })()}
                    </td>
                    <td>
                      <button className={`btn-view btn-${normalizeVerification(order.payment_verification_status ?? order.payment_status ?? '')}`} onClick={() => handleViewOrder(order.id)}>View Details</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OrderHistory
