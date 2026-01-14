import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../services/AuthService'
import { apiClient, API_ENDPOINTS } from '../../services/api'
import orderApi from '../../services/orderApi'
import './CheckoutPage.css'

function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useContext(AuthContext)

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    phone: '',
    shipping_address: '',
    notes: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchCart = async () => {
      try {
        setLoading(true)
        const data = await apiClient.get(API_ENDPOINTS.CART.LIST)
        setCart(data)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Failed to load cart')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.phone || !formData.shipping_address) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const orderPayload = {
        phone: formData.phone,
        shipping_address: formData.shipping_address,
        notes: formData.notes,
      }

      const response = await orderApi.placeOrder(orderPayload)

      setSuccessMessage('Order placed successfully!')
      setTimeout(() => {
        navigate(`/order/${response.id}`)
      }, 1500)
    } catch (err) {
      console.error('Error placing order:', err)
      setError(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p className="error-message">Please login to checkout</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p className="loading-message">Loading cart...</p>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn-shop" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        {/* Left: Order Form */}
        <div className="checkout-form-section">
          <div className="form-card">
            <h2>Shipping Information</h2>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +92 300 1234567"
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipping_address">Shipping Address *</label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  placeholder="Enter your full shipping address"
                  className="form-input"
                  rows="4"
                  required
                  disabled={submitting}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery"
                  className="form-input"
                  rows="3"
                  disabled={submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="items-preview">
              <h4>Items in Cart ({cart.items.length})</h4>
              <div className="items-list">
                {cart.items.map((item) => (
                  <div key={item.id} className="item-preview">
                    <div className="item-image">
                      {item.product?.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.product?.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      Rs {(item.product?.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rs {cart.total}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>

            <div className="summary-row">
              <span>Tax:</span>
              <span>Rs 0</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total Amount:</span>
              <span>Rs {parseInt(cart.total)}</span>
            </div>

            <p className="payment-note">
              You will be asked to upload payment screenshots after placing the order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
