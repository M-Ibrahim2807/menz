import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/AuthService';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE}${path}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [reviewsSubmitting, setReviewsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id, quantity: 1 }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add to cart');
      }

      // simple feedback
      alert('Added to cart');
    } catch (err) {
      alert(err.message || 'Add to cart failed');
    } finally {
      setAdding(false);
    }
  }

  async function handleAddToWishlist() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/wishlist/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to add to wishlist');
      alert(data.message || 'Added to wishlist');
    } catch (err) {
      alert(err.message || 'Wishlist failed');
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/products/${id}/reviews/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      // reload reviews
      const r = await fetch(`${API_BASE}/api/products/${id}/`);
      const d = await r.json();
      setProduct(d);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.message || 'Submit failed');
    } finally {
      setReviewsSubmitting(false);
    }
  }

  if (loading) return <div className="container">Loading product...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!product) return <div className="container">Product not found.</div>;

  const img = product.image_url ? product.image_url : buildImageUrl(product.image || '');

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
          {img ? <img src={img} alt={product.name} style={{ width: '100%', borderRadius: 8 }} /> : (
            <div style={{ width: '100%', height: 300, background: '#f5f5f7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No image</div>
          )}
        </div>

        <div style={{ flex: '1 1 320px', textAlign: 'left' }}>
          <h2>{product.name}</h2>
          <p style={{ color: '#2b3aee', fontWeight: 700, fontSize: '1.25rem' }}>${product.price}</p>
          <p>{product.description}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <div style={{ marginTop: 16 }}>
            <h3>Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <div style={{ fontWeight: 700 }}>{r.user_email}</div>
                  <div>Rating: {r.rating}</div>
                  <div>{r.comment}</div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            <form onSubmit={submitReview} style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8 }}>
                <label>Rating: </label>
                <select value={reviewForm.rating} onChange={e => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}>
                  {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} rows={3} style={{ width: '100%' }} placeholder="Write a review..." />
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="auth-button primary" type="submit" disabled={reviewsSubmitting}>{reviewsSubmitting ? 'Submitting...' : 'Submit Review'}</button>
              </div>
            </form>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="auth-button primary" onClick={handleAddToCart} disabled={adding}>
              {adding ? 'Adding...' : 'Add to cart'}
            </button>
            <button style={{ marginLeft: 12 }} className="auth-button" onClick={handleAddToWishlist}>
              Add to wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
