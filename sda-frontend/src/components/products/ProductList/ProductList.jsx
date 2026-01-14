import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import { apiClient, API_ENDPOINTS } from '../../../services/api'
import './ProductList.css'

function ProductList() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build URL based on whether category is provided
        let url
        if (category) {
          // Use category-specific endpoint: /api/products/category/{category}/
          url = `http://localhost:8000/api/products/category/${category}/`
        } else {
          // Use general list endpoint
          url = API_ENDPOINTS.PRODUCTS.LIST
        }
        
        console.log('Fetching from:', url)
        const data = await apiClient.get(url)
        console.log('API Response:', data)
        console.log('First product:', data[0] || (Array.isArray(data) ? 'empty array' : data))
        
        // Handle paginated or direct response
        const productList = Array.isArray(data) ? data : data.results || data.products || []
        console.log('Products to display:', productList)
        productList.forEach((p, i) => {
          console.log(`Product ${i}:`, { id: p.id, name: p.name, image: p.image, image_url: p.image_url })
        })
        
        setProducts(productList)
      } catch (err) {
        const errorMsg = err.message || 'Failed to fetch products'
        console.error('Error fetching products:', errorMsg, err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return (
    <div className="product-list-container">
      <h1>{category ? `${category.toUpperCase()} - Products` : 'All Products'}</h1>
      
      {loading && <p className="loading-text">Loading products...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      
      {!loading && products.length === 0 && (
        <p className="no-products">No products found</p>
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

export default ProductList
