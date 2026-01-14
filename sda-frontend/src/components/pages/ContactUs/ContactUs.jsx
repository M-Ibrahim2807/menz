import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-top-section">
        <div className="top-card">
          <h3> Email Support</h3>
          <p className="info-text">
            <a href="mailto:itsmenzwardrobe@gmail.com">itsmenzwardrobe@gmail.com</a>
          </p>
          <p className="info-subtitle">We typically respond within 24 hours</p>
        </div>

        <div className="top-card">
          <h3> Call Us</h3>
          <p className="info-text">
            <a href="tel:+923324561278">+92 332 456 1278</a>
          </p>
          <p className="info-subtitle">Mon - Fri: 10:00 AM - 6:00 PM<br/>Sat - Sun: 11:00 AM - 4:00 PM</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>How Can We Help?</h2>

          <div className="info-card social">
            <h3>Follow Menz Fashion</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/MenzFashion" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                 Instagram
              </a>
              <a href="https://www.facebook.com/MenzFashion" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                 Facebook
              </a>
            </div>
          </div>

          <div className="info-card faq">
            <h3> Frequently Asked Questions</h3>
            <div className="faq-items">
              <div className="faq-item">
                <strong>Shipping Time?</strong>
                <p>Standard delivery takes 2-3 business days</p>
              </div>
              <div className="faq-item">
                <strong>Return Policy?</strong>
                <p>14 days in original condition with tags</p>
              </div>
              <div className="faq-item">
                <strong>Order Tracking?</strong>
                <p>Tracking number sent via email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
