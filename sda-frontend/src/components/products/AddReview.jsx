import React, { useState, useContext } from 'react';
import { AuthContext } from '../../services/AuthService';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AddReview({ productId, onReviewAdded }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to add a review');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/products/${productId}/reviews/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: parseInt(rating), comment })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
      <h3>Add Your Review</h3>

      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#27ae60', marginBottom: 12 }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Rating</label>
          <select
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="form-input"
            disabled={loading}
          >
            {[5, 4, 3, 2, 1].map(v => (
              <option key={v} value={v}>
                {v} Stars
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="form-input"
            placeholder="Share your experience..."
            rows={3}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="auth-button primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
