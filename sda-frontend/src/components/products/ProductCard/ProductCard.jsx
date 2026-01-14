import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)
  
  if (!product) return null

  // Use image_url from backend, fallback to image field
  const imageUrl = product?.image_url || product?.image

  const handleImageError = () => {
    console.error('Image failed to load:', imageUrl)
    setImageError(true)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Added to cart:', product.id)
    // TODO: Add to cart functionality
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={product.name}
              onError={handleImageError}
              onLoad={() => console.log('Image loaded:', imageUrl)}
            />
          ) : null}
          {(!imageUrl || imageError) && (
            <div className="image-placeholder">No Image</div>
          )}
          {/* Stock Indicator */}
          <div className="stock-badge">
            <span className="stock-icon">📦</span>
            <span className="stock-count">{product.stock || 0}</span>
          </div>
          {/* No Stock Message */}
          {(!product.stock || product.stock === 0) && (
            <div className="out-of-stock-overlay">NO STOCK AVAILABLE</div>
          )}
        </div>

        {/* Divider Line */}
        <div className="card-divider"></div>

        <div className="product-body">
          <h3 className="product-name">{(product.name || 'Product').toUpperCase()}</h3>
          <div className="product-footer">
            <p className="product-price">PKR {parseFloat(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <button className="add-to-cart-btn" onClick={handleAddToCart} title="Add to cart" disabled={!product.stock || product.stock === 0}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
