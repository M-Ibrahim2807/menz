import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load order');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitPayment(e) {
    e.preventDefault();
    if (!paymentScreenshot) {
      alert('Please select a screenshot');
      return;
    }

    setPaymentSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('order', id);
      formData.append('screenshot', paymentScreenshot);
      formData.append('status', 'pending');

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/payments/create/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'Payment submission failed');

      alert('Payment submitted! Admin will verify and update order status.');
      setPaymentScreenshot(null);
      loadOrder(); // reload order
    } catch (err) {
      alert(err.message || 'Payment submission failed');
    } finally {
      setPaymentSubmitting(false);
    }
  }

  if (loading) return <div className="container">Loading order...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!order) return <div className="container">Order not found.</div>;

  const statusColor = {
    pending: '#f39c12',
    paid: '#27ae60',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#16a085',
    cancelled: '#e74c3c',
    refunded: '#95a5a6',
  };

  return (
    <div className="container">
      <h2>Order #{order.id}</h2>
      <p style={{ fontSize: '1.1rem', color: statusColor[order.status] || '#333' }}>
        Status: <strong>{order.status.toUpperCase()}</strong>
      </p>

      <div style={{ marginTop: 24 }}>
        <h3>Items</h3>
        {order.items && order.items.length > 0 ? (
          order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ width: 80 }}>
                <img
                  src={item.product.image_url || item.product.image || ''}
                  alt={item.product.name}
                  style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{item.product_name}</div>
                <div>Qty: {item.quantity}</div>
              </div>
              <div>
                <div>${item.price_at_purchase}</div>
                <div>Subtotal: ${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in this order.</p>
        )}
      </div>

      <div style={{ marginTop: 24, padding: '16px', backgroundColor: '#f9f9f9', borderRadius: 8 }}>
        <h3>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
          <span>Total:</span>
          <span>${order.total_amount}</span>
        </div>
        {order.loyalty_points_earned > 0 && (
          <div style={{ marginTop: 8 }}>Loyalty Points Earned: {order.loyalty_points_earned}</div>
        )}
      </div>

      {order.status === 'pending' && (
        <div style={{ marginTop: 24, padding: '16px', backgroundColor: '#fff3cd', borderRadius: 8 }}>
          <h3>Payment Required</h3>
          <p>Please upload a payment screenshot to complete your order.</p>
          <form onSubmit={submitPayment} style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPaymentScreenshot(e.target.files[0])}
                disabled={paymentSubmitting}
              />
            </div>
            <button className="auth-button primary" type="submit" disabled={paymentSubmitting}>
              {paymentSubmitting ? 'Submitting...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
