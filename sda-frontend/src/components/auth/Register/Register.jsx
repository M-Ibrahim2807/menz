import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../services/AuthService'
import './Register.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setSuccessMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setError('')

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        phone: formData.phone || '',
        address: formData.address || '',
      }

      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400) {
          // Handle specific field errors from backend. Backend may return:
          // { error: 'Registration failed', details: { email: ['...'] } }
          // or DRF-style: { email: ['...'], username: ['...'] }
          try {
            // Prefer `details` if present
            const detailObj = data.details && typeof data.details === 'object' ? data.details : null

            const source = detailObj || (typeof data === 'object' ? data : null)

            if (source) {
              const errorMessages = Object.entries(source)
                .map(([key, value]) => {
                  if (Array.isArray(value)) return `${key}: ${value.join(', ')}`
                  if (typeof value === 'object') return `${key}: ${JSON.stringify(value)}`
                  return `${key}: ${String(value)}`
                })
                .join('\n')

              // If `detailObj` existed but there is also a top-level `error`, include it
              const top = data.error || data.detail || null
              setError(top ? `${top}\n${errorMessages}` : errorMessages)
            } else {
              setError(data.detail || data.error || 'Registration failed. Please check your input.')
            }
          } catch (parseErr) {
            setError('Registration failed. Please check your input.')
          }
        } else if (response.status === 409) {
          setError('Email or username already exists')
        } else {
          setError(data.detail || data.error || 'Registration failed. Please try again.')
        }
        setLoading(false)
        return
      }

      // Successful registration
      setSuccessMessage('Account created successfully! Logging you in...')

      // Auto-login after successful registration (backend returns `tokens`)
      if (data.user && data.tokens) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          name: data.user.username,
        }
        // Prefer access token for client auth storage
        const accessToken = data.tokens.access || data.tokens
        login(userData, accessToken)

        // Give the app a short moment to update AuthContext and header, then navigate home
        setTimeout(() => {
          navigate('/')
        }, 800)
      } else if (data.user) {
        // No tokens returned — show message and keep user on page so they can sign in
        setSuccessMessage('Account created. Please sign in to continue.')
      }
    } catch (err) {
      setError('Network error. Please make sure the backend server is running at http://127.0.0.1:8000')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our community</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="(Optional)"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="(Optional)"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-link-button">
          Sign In Here
        </Link>

        <div className="auth-footer">
          <p className="footer-text">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
