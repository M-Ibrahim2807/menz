import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

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
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(o => (
          <Link key={o.id} to={`/order/${o.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s', backgroundColor: '#fafafa' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafa'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Order #{o.id}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Date: {new Date(o.order_date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: statusColor[o.status] || '#333', fontWeight: 700 }}>{o.status.toUpperCase()}</div>
                  <div>Total: ${o.total_amount}</div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
