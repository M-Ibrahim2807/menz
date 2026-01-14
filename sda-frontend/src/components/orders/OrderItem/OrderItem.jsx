import React from 'react'
import './OrderItem.css'

function OrderItem({ item }) {
  return (
    <div className="order-item">
      <div className="item-image">
        {item.product?.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
      </div>

      <div className="item-details">
        <h4 className="item-name">{item.product?.name || 'Unknown Product'}</h4>
        <p className="item-category">{item.product?.category || 'N/A'}</p>
      </div>

      <div className="item-qty">
        <span className="label">Qty:</span>
        <span className="value">{item.quantity}</span>
      </div>

      <div className="item-price">
        <span className="label">Price:</span>
        <span className="value">Rs {parseFloat(item.price_at_purchase).toFixed(2)}</span>
      </div>
      <div className="item-subtotal">
        <span className="label">Subtotal:</span>
        <span className="value">Rs {(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  )
}

export default OrderItem
