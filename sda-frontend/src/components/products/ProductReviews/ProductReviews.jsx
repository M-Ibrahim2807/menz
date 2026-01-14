import React from 'react'
import './ProductReviews.css'

function ProductReviews({ reviews }) {
  return (
    <div className="product-reviews-container premium-reviews">
      <h2>Reviews</h2>
      {(!reviews || reviews.length === 0) ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-user">{review.user_email || 'Anonymous'}</span>
                <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <div className="review-comment">{review.comment}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductReviews
