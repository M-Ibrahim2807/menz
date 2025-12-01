import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}/reviews/`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{r.user_email}</div>
              <div style={{ color: '#f39c12' }}>{'⭐'.repeat(r.rating)}</div>
            </div>
            <p>{r.comment}</p>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              {new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
