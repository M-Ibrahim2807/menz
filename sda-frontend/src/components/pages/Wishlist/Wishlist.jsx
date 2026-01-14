import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../services/AuthService'
import { apiClient, API_ENDPOINTS } from '../../../services/api'
import './Wishlist.css'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    fetchWishlist()
  }, [isAuthenticated, navigate])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get(API_ENDPOINTS.WISHLIST.LIST)
      setWishlist(data.items || [])
    } catch (err) {
      console.error('Error fetching wishlist:', err)
      setError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(itemId))
      setWishlist(wishlist.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Failed to remove item')
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await apiClient.post(API_ENDPOINTS.CART.ADD, { product_id: productId })
      alert('Added to cart')
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError('Failed to add to cart')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <p className="error-message">Please login to view your wishlist</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <p className="loading-message">Loading wishlist...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <p className="error-message">{error}</p>
      </div>
    )
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <div className="empty-state">
          <p>Your wishlist is empty</p>
          <button 
            className="btn-continue-shopping"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="item-count">({wishlist.length} items)</p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-image">
              {item.product?.image_url ? (
                <img src={item.product.image_url} alt={item.product.name} />
              ) : (
                <div className="image-placeholder">No Image</div>
              )}
            </div>
            
            <div className="card-divider"></div>
            
            <div className="wishlist-body">
              <h3 className="product-name">{(item.product?.name || 'Product').toUpperCase()}</h3>
              
              <div className="wishlist-footer">
                <p className="product-price">Rs {parseFloat(item.product?.price || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <button 
                  className="remove-wishlist-btn"
                  onClick={() => handleRemove(item.id)}
                  title="Remove from wishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                  </svg>
                </button>
              </div>
              
              <button 
                className="add-to-cart-wishlist-btn"
                onClick={() => handleAddToCart(item.product?.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
