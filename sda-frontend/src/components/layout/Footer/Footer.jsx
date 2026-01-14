import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© 2025 Menz. All Rights Reserved.</p>
          <div className="footer-links">
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="footer-link">Terms of service</Link>
            <Link to="/contact-us" className="footer-link">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer