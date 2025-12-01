import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function ProductList() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const catPath = category ? `category/${category}/` : '';
    fetch(`${API_BASE}/api/products/${catPath}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <div className="container">Loading products...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container products-grid">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))
      )}
    </div>
  );
}
