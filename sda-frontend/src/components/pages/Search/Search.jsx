import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../products/ProductCard/ProductCard'
import './Search.css'

function Search() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all products and filter by name
        const response = await fetch('http://localhost:8000/api/products/')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        const allProducts = Array.isArray(data) ? data : data.results || []
        
        // Filter products by name (case-insensitive)
        const filteredProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        setProducts(filteredProducts)
      } catch (err) {
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery])

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Results for "{searchQuery}"</h1>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      
      {error && <div className="error-message">Error: {error}</div>}
      
      {!loading && products.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No products found matching "{searchQuery}"</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Search

