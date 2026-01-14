import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyAccount.css'

function MyAccount() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: 'User Name',
    email: 'user@example.com',
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="myaccount-container">
      <div className="myaccount-header">
        <h1>My Account</h1>
      </div>

      <div className="myaccount-content">
        {/* Left Column - User Info */}
        <div className="myaccount-left">
          <div className="user-profile-card">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Right Column - Account Options */}
        <div className="myaccount-right">
          <div className="account-options-grid">
            {/* Row 1 */}
            <div className="option-group">
              <div className="option-icon">🛒</div>
              <button className="option-btn">Manage Cart</button>
            </div>

            <div className="option-group">
              <div className="option-icon">⏱️</div>
              <button className="option-btn">View Order History</button>
            </div>

            {/* Row 2 */}
            <div className="option-group">
              <div className="option-icon">❤️</div>
              <button className="option-btn">Manage Wishlist</button>
            </div>

            <div className="option-group">
              <div className="option-icon">📦</div>
              <button className="option-btn">View Order Status</button>
            </div>

            {/* Row 3 */}
            <div className="option-group">
              <div className="option-icon">⭐</div>
              <button className="option-btn">Write Reviews</button>
            </div>

            <div className="option-group">
              <div className="option-icon">👤</div>
              <button className="option-btn">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
