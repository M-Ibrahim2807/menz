import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../services/AuthService';

class Header extends React.Component {
  static contextType = AuthContext;

  render() {
    const { isAuthenticated, user, logout } = this.context;
    const categories = [
      { label: 'Home', value: 'home' },
      { label: 'Pants', value: 'penta' },
      { label: 'Shirt', value: 'shirt' },
      { label: 'Shalwar Kameez', value: 'shalwar_kameez' },
      { label: 'Accessories', value: 'accessories' },
    ];

    return (
      <header className="header">
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="nav-brand">
              <h2><Link to="/" className="brand-link">Ecommerce Store</Link></h2>
            </div>

            <div className="nav-categories">
              {categories.map(cat => (
                <Link key={cat.value} to={cat.value === 'home' ? '/' : `/category/${cat.value}`} className="nav-link">
                  {cat.label}
                </Link>
              ))}
              <Link to="/about" className="nav-link">About</Link>
            </div>

            <div className="nav-links">
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="nav-link">Cart</Link>
                  <Link to="/wishlist" className="nav-link">Wishlist</Link>
                  <Link to="/orders" className="nav-link">Orders</Link>
                  <div className="user-menu">
                    <span>Welcome, {user?.username}</span>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <button onClick={logout} className="btn-logout">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Register</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;