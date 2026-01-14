import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setLoading(false)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        setError('Failed to load profile')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Error loading profile')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleManageCart = () => {
    navigate('/cart')
  }

  const handleViewOrders = () => {
    navigate('/order-history')
  }

  const handleManageWishlist = () => {
    navigate('/wishlist')
  }

  const handleViewOrderStatus = () => {
    navigate('/orders')
  }

  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        {/* Left Column - User Info */}
        <div className="profile-left">
          <div className="user-profile-card">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h2 className="user-name">
              {user.first_name || user.email.split('@')[0]}
            </h2>
            <p className="user-email">{user.email}</p>
            <p className="user-phone">{user.phone || 'No phone added'}</p>
            <p className="user-address">{user.address || 'No address added'}</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Right Column - Account Options */}
        <div className="profile-right">
          <div className="account-options-grid">
            {/* Row 1 */}
            <div className="option-group">
              <div className="option-icon">🛒</div>
              <button className="option-btn" onClick={handleManageCart}>
                Manage Cart
              </button>
            </div>

            <div className="option-group">
              <div className="option-icon">⏱️</div>
              <button className="option-btn" onClick={handleViewOrders}>
                View Order History
              </button>
            </div>

            {/* Row 2 */}
            <div className="option-group">
              <div className="option-icon">❤️</div>
              <button className="option-btn" onClick={handleManageWishlist}>
                Manage Wishlist
              </button>
            </div>

            <div className="option-group">
              <div className="option-icon">📦</div>
              <button className="option-btn" onClick={handleViewOrderStatus}>
                View Order Status
              </button>
            </div>

            {/* Row 3 */}
            <div className="option-group">
              <div className="option-icon">👤</div>
              <button className="option-btn" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
