import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiClient } from '../../services/api'
import { orderApi } from '../../services/orderApi'
import './PaymentUploadPage.css'

function PaymentUploadPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const cart = location.state?.cart || null
  const total = location.state?.total || (cart ? cart.total : 0)

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files))
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!files || files.length === 0) {
      setError('Please choose at least one payment screenshot to upload')
      return
    }

    try {
      setUploading(true)

      // Step 1: Place the order first using cart
      const orderPayload = {
        use_cart: true, // Use items from user's cart
        shipping_address: '', // optional; can be filled later if needed
      }

      const orderResp = await orderApi.placeOrder(orderPayload)
      // OrderSerializer returns { id, user, order_date, status, total_amount, ... }
      const orderId = orderResp.id

      if (!orderId) {
        throw new Error('Failed to create order: No order ID returned')
      }

      // Step 2: Upload payment screenshot(s) for the created order
      // Payment model expects: order (FK to Order), screenshot (ImageField)
      // NOTE: Payment uses OneToOneField, so only ONE payment per order
      // Use fetch directly for FormData to avoid JSON stringification
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
      const token = localStorage.getItem('token')

      // Only upload the first file since Payment is OneToOne with Order
      const file = files[0]
      const paymentFormData = new FormData()
      paymentFormData.append('order', orderId)
      paymentFormData.append('screenshot', file)

      console.log('Uploading payment with order:', orderId, 'file:', file.name)

      const paymentResp = await fetch(`${API_BASE_URL}/api/payments/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // DO NOT set Content-Type; let browser set it as multipart/form-data
        },
        body: paymentFormData,
      })

      const paymentData = await paymentResp.json()
      console.log('Payment response:', paymentData)

      if (!paymentResp.ok) {
        console.error('Payment upload failed with status:', paymentResp.status)
        console.error('Payment error details:', paymentData)
        
        // Extract meaningful error message
        let errorMsg = 'Payment upload failed'
        if (paymentData.detail) errorMsg = paymentData.detail
        else if (paymentData.error) errorMsg = paymentData.error
        else if (paymentData.order) errorMsg = `Order error: ${JSON.stringify(paymentData.order)}`
        else if (paymentData.screenshot) errorMsg = `Screenshot error: ${JSON.stringify(paymentData.screenshot)}`
        else errorMsg = JSON.stringify(paymentData)
        
        throw new Error(errorMsg)
      }

      console.log('Payment created:', paymentData)

      setSuccess('Order placed! Payment screenshots uploaded. Admin will verify your payment shortly.')
      setFiles([])
      // Navigate back to cart to show order status
      setTimeout(() => navigate('/cart', { state: { orderId } }), 2000)
    } catch (err) {
      console.error('Error:', err)
      const errorMsg = err.message || 'Failed to process order and payment'
      setError(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="payment-upload-container">
      <div className="payment-card">
        <h1>Upload Payment Screenshots</h1>
        <p className="subtitle">Please upload your payment screenshots so we can verify your payment.</p>

        <div className="summary">
          <div className="summary-row"><span>Payable Amount</span><strong>Rs {total}</strong></div>
        </div>

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form className="upload-form" onSubmit={handleSubmit}>
          <label className="file-input-label">
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
            <div className="file-chooser">Choose Payment Screenshots</div>
          </label>

          <div className="selected-list">
            {files.map((f, i) => (
              <div key={i} className="file-row">{f.name}</div>
            ))}
          </div>

          <div className="actions">
            <button type="submit" className="btn-upload" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload & Place Order'}</button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentUploadPage
