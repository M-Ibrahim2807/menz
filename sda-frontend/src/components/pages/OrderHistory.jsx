import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/history/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder(orderId, status) {
    if (!['pending', 'processing'].includes(status)) {
      alert('Cannot cancel order with status: ' + status);
      return;
    }

    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to cancel order');

      alert('Order cancelled successfully');
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  async function requestRefund(orderId) {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/refund/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to request refund');

      alert('Refund request submitted');
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  async function downloadInvoice(orderId) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/invoice/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error('Failed to generate invoice');

      // Create and download JSON as file
      const element = document.createElement('a');
      element.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      );
      element.download = `invoice-${orderId}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      alert(err.message);
    }
  }

  const statusColor = {
    pending: '#f39c12',
    paid: '#27ae60',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#16a085',
    cancelled: '#e74c3c',
    refunded: '#95a5a6',
  };

  if (loading) return <div className="container">Loading orders...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              padding: 16,
              borderBottom: '1px solid #eee',
              marginBottom: 12,
              backgroundColor: '#fafafa',
              borderRadius: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order.id}</div>
                <div style={{ color: '#666' }}>Date: {new Date(order.order_date).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: statusColor[order.status] || '#333', fontWeight: 700 }}>
                  {order.status.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: ${order.total_amount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Link to={`/order/${order.id}`}>
                <button className="auth-button primary" style={{ width: 'auto', padding: '8px 16px' }}>
                  View
                </button>
              </Link>

              {['pending', 'processing'].includes(order.status) && (
                <button
                  onClick={() => cancelOrder(order.id, order.status)}
                  style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}

              {['delivered'].includes(order.status) && (
                <button
                  onClick={() => requestRefund(order.id)}
                  style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                >
                  Request Refund
                </button>
              )}

              <button
                onClick={() => downloadInvoice(order.id)}
                style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
              >
                Invoice
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
