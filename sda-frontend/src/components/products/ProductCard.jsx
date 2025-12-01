import React from 'react';
import { Link } from 'react-router-dom';

function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
  // ensure leading slash
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE}${path}`;
}

export default function ProductCard({ product }) {
  const img = product.image_url ? product.image_url : buildImageUrl(product.image || '');

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        {img ? (
          <img src={img} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image placeholder">No image</div>
        )}
        <div className="product-body">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price}</p>
        </div>
      </div>
    </Link>
  );
}
