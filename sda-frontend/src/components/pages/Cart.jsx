import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Failed to load cart');
        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="container">Loading cart...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!cart) return <div className="container">No cart found.</div>;

  async function updateQty(itemId, qty) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/cart/update/${itemId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      const data = await res.json();
      // reload cart
      setCart(prev => ({ ...prev }));
      // reload full
      const r = await fetch(`${API_BASE}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setCart(d);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  }

  async function removeItem(itemId) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/cart/remove/${itemId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove item');
      const r = await fetch(`${API_BASE}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setCart(d);
    } catch (err) {
      alert(err.message || 'Remove failed');
    }
  }

  async function placeOrder() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/orders/place/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ use_cart: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order placement failed');
      alert('Order placed: #' + data.id);
      // reload cart
      const r = await fetch(`${API_BASE}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setCart(d);
    } catch (err) {
      alert(err.message || 'Place order failed');
    }
  }

  async function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/cart/clear/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to clear cart');
      alert('Cart cleared');
      const r = await fetch(`${API_BASE}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setCart(d);
    } catch (err) {
      alert(err.message || 'Clear failed');
    }
  }

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.items && cart.items.length > 0 ? (
        <div>
          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ width: 80 }}>
                <img src={item.product.image_url || item.product.image || ''} alt={item.product.name} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                <div style={{ color: '#666' }}>${item.product.price} each</div>
              </div>
              <div>
                <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ width: 100, textAlign: 'right' }}>${item.subtotal}</div>
              <div>
                <button onClick={() => removeItem(item.id)} style={{ color: '#e74c3c' }}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <div style={{ marginBottom: 8 }}>Total: <strong>${cart.total}</strong></div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="auth-button primary" onClick={placeOrder}>Place Order</button>
              <button 
                className="auth-button" 
                onClick={clearCart}
                style={{ background: '#e74c3c', color: 'white', width: 'auto' }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
