import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../products/ProductCard/ProductCard'
import { apiClient, API_ENDPOINTS } from '../../../services/api'
import { AuthContext } from '../../../services/AuthService'
import './Home.css'

function Home() {
  const [heroProduct, setHeroProduct] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    setFadeIn(true)
    const fetch = async () => {
      setLoading(true)
      try {
        const cats = ['shirt','pents','shalwar_kameez','accessories']
        const categoryMap = {}

        // First try fetching all products to test basic connectivity
        try {
          console.log('Testing basic connectivity - fetching all products...')
          const allProducts = await apiClient.get('http://localhost:8000/api/products/')
          console.log('All products response:', allProducts)
        } catch (testErr) {
          console.error('Basic connectivity test failed:', testErr)
        }

        // Fetch hero product (shalwar_kameez)
        try {
          console.log('Fetching hero product from: http://localhost:8000/api/products/category/shalwar_kameez/')
          const heroData = await apiClient.get('http://localhost:8000/api/products/category/shalwar_kameez/')
          console.log('Hero data response:', heroData)
          const heroList = Array.isArray(heroData) ? heroData : heroData.results || []
          console.log('Hero list:', heroList)
          if (heroList.length) setHeroProduct(heroList[0])
        } catch (e) { console.error('hero fetch error:', e) }

        for (let cat of cats) {
          try {
            console.log(`Fetching ${cat} category from: http://localhost:8000/api/products/category/${cat}/`)
            const data = await apiClient.get(`http://localhost:8000/api/products/category/${cat}/`)
            console.log(`${cat} response:`, data)
            const list = Array.isArray(data) ? data : data.results || []
            console.log(`${cat} list:`, list)
            if (list.length) categoryMap[cat] = list[0]
          } catch (err) { console.error(`${cat} fetch error:`, err) }
        }

        console.log('Final categoryMap:', categoryMap)
        setCategoryProducts(categoryMap)
      } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const heroImageUrl = heroProduct?.image_url || heroProduct?.image || ''

  const handleAddToCart = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setAddingToCart(true)
      await apiClient.post(API_ENDPOINTS.CART.ADD, { product_id: heroProduct.id })
      alert('Added to cart!')
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleExploreCollection = (e) => {
    e.preventDefault()
    navigate('/category/shalwar_kameez')
  }

  const handleProductClick = (e) => {
    e.preventDefault()
    if (heroProduct) navigate(`/product/${heroProduct.id}`)
  }

  return (
    <div className={`home-container ${fadeIn ? 'fade-in' : ''}`}>
      <section className="hero-section">
        <div className="hero-wrapper">
          {heroImageUrl ? (
            <img 
              src={heroImageUrl} 
              className="hero-image" 
              alt="featured"
            />
          ) : <div className="hero-placeholder">Featured</div>}
          <div className="hero-overlay" />
          <div className="hero-content">
            {heroProduct && (
              <>
                <h2 className="hero-product-name" onClick={handleProductClick} style={{ cursor: 'pointer', margin: '0 0 8px 0' }}>
                  {heroProduct.name.toUpperCase()}
                </h2>
                <p className="hero-product-price" onClick={handleProductClick} style={{ cursor: 'pointer', margin: '0 0 20px 0' }}>
                  Rs {parseFloat(heroProduct.price).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </>
            )}
            <h1 className="hero-title">Discover Fashion</h1>
            <p className="hero-subtitle">Premium clothing for every style</p>
            <div className="hero-buttons">
              <button className="hero-btn" onClick={handleExploreCollection}>See Collection</button>
              {heroProduct && (
                <button 
                  className="hero-add-to-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={addingToCart || !heroProduct.stock}
                  title={!heroProduct.stock ? 'Out of stock' : 'Add to cart'}
                >
                  {addingToCart ? 'Adding...' : heroProduct.stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="popular-products-section">
        <div className="section-header">
          <h2 className="section-title">Popular Products</h2>
          
          <h3 className="section-subtitle">Discover fresh styles from the emerging fashion industry.</h3>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {Object.entries(categoryProducts).map(([category, product], idx) => (
              product ? (
                <div key={product.id} className="product-wrapper" style={{ '--delay': `${idx * 0.08}s` }}>
                  <ProductCard product={product} />
                </div>
              ) : null
            ))}
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature-card"><div className="feature-icon">📦</div><h3>Fast Shipping</h3><p>Quick delivery to your doorstep</p></div>
          <div className="feature-card"><div className="feature-icon">🔄</div><h3>Easy Returns</h3><p>Hassle-free returns within 30 days</p></div>
          <div className="feature-card"><div className="feature-icon">🛡️</div><h3>Secure Payment</h3><p>100% secure transactions</p></div>
          <div className="feature-card"><div className="feature-icon">💬</div><h3>24/7 Support</h3><p>Always here to help you</p></div>
        </div>
      </section>
    </div>
  )
}

export default Home
