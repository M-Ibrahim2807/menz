import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/wishlist/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load wishlist');
        const data = await res.json();
        // API returns wishlist object with items
        if (data.items) setItems(data.items);
        else setItems(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="container">Loading wishlist...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  async function removeItem(itemId) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/wishlist/remove/${itemId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove item');
      // reload
      const r = await fetch(`${API_BASE}/api/wishlist/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setItems(d.items || []);
    } catch (err) {
      alert(err.message || 'Remove failed');
    }
  }

  return (
    <div className="container">
      <h2>Your Wishlist</h2>
      {items.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        items.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div>{i.product?.name}</div>
            <div>
              <button onClick={() => removeItem(i.id)} style={{ color: '#e74c3c' }}>Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
