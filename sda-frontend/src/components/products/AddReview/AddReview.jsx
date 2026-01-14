import React, { useState, useContext } from 'react'
import { apiClient } from '../../../services/api'
import { AuthContext } from '../../../services/AuthService'
import './AddReview.css'

function AddReview({ productId, onReviewAdded }) {
  const { isAuthenticated } = useContext(AuthContext)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Authentication check
    if (!isAuthenticated) {
      setError('Please login to submit a review')
      return
    }
    
    // Validation
    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a valid rating')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const payload = {
        product_type: 'clothing',
        product_id: parseInt(productId),
        rating: parseInt(rating),
        comment: comment.trim(),
      }
      
      const res = await apiClient.post(`http://localhost:8000/api/products/${productId}/reviews/add/`, payload)
      
      if (res && (res.id || res.success)) {
        setSuccess('Review submitted successfully!')
        setComment('')
        setRating(5)
        // Call callback to refresh reviews
        if (onReviewAdded) {
          setTimeout(() => onReviewAdded(), 800)
        }
      } else {
        setError(res?.error || 'Failed to submit review')
      }
    } catch (err) {
      console.error('Review submission error:', err)
      let errMsg = 'Failed to submit review'
      
      if (err.response?.status === 401) {
        errMsg = 'Please login to submit a review'
      } else if (err.response?.status === 403) {
        errMsg = 'You do not have permission to submit a review'
      } else if (err.response?.status === 404) {
        errMsg = 'Product not found'
      } else if (err.response?.data?.error) {
        errMsg = err.response.data.error
      } else if (err.message) {
        errMsg = err.message
      }
      
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="add-review-container">
        <h2>Leave a Review</h2>
        <div className="error-text">Please log in to submit a review</div>
      </div>
    )
  }

  return (
    <div className="add-review-container">
      <h2>Leave a Review</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Rating:
          <select value={rating} onChange={e => setRating(Number(e.target.value))} disabled={loading}>
            <option value={5}>5 Stars - Excellent</option>
            <option value={4}>4 Stars - Very Good</option>
            <option value={3}>3 Stars - Good</option>
            <option value={2}>2 Stars - Fair</option>
            <option value={1}>1 Star - Poor</option>
          </select>
        </label>
        <label>
          Comment:
          <textarea 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
            placeholder="Share your experience with this product..."
            disabled={loading}
            maxLength={500}
          />
          <small style={{color: '#64748b', fontSize: '12px'}}>{comment.length}/500</small>
        </label>
        <button type="submit" disabled={loading || !comment.trim()}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      {error && <div className="error-text">{error}</div>}
      {success && <div className="success-text">{success}</div>}
    </div>
  )
}

export default AddReview
