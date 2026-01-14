import React, { useState, useEffect, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../services/AuthService'
import './Header.css'

function Header() {
  const categories = [
    { label: 'Home', value: 'home' },
      { label: 'Pents', value: 'pents' },
    { label: 'Shirt', value: 'shirt' },
    { label: 'Shalwar Kameez', value: 'shalwar_kameez' },
    { label: 'Accessories', value: 'accessories' },
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useContext(AuthContext)

  // Keep header always visible and fixed at top. Removed hide-on-scroll behavior.

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header visible">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <Link to="/" className="brand-link">Menz</Link>
          </div>

          <div className="topbar-center">
            <form className="search-form" onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>
          </div>

          <div className="topbar-right">
            <div className="icons-group">
              <Link to="/profile" className="icon-btn icon-profile" aria-label="profile">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="cart">🛒</Link>
            </div>
            {isAuthenticated ? (
              <>
                <span className="user-greeting">{user?.username || user?.email || 'User'}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login small">Login</Link>
                <Link to="/register" className="btn-register small">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="secondary-nav">
        <div className="secondary-inner">
          <div className="nav-categories">
            {categories.map((cat) => (
              <NavLink
                key={cat.value}
                to={cat.value === 'home' ? '/' : `/category/${cat.value}`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {cat.label}
              </NavLink>
            ))}
            <NavLink 
              to="/about" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
