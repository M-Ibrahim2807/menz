import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Menz</h1>
          <p className="hero-subtitle">Redefining Fashion, One Style at a Time</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              At Menz, we are committed to revolutionizing the fashion industry by offering premium quality clothing that celebrates Pakistani heritage and contemporary style. Our mission is to empower individuals to express their unique identity through carefully curated collections that blend tradition with innovation.
            </p>
          </div>

          <div className="vision-card">
            <div className="card-icon">✨</div>
            <h3>Our Vision</h3>
            <p>
              We envision becoming the leading e-commerce destination for men's fashion in South Asia, recognized for our exceptional product quality, outstanding customer service, and commitment to sustainable fashion practices. We aim to make premium fashion accessible to everyone while supporting local artisans and craftspeople.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>Who We Are</h2>
        <div className="about-content">
          <p>
            Menz is a progressive e-commerce platform dedicated to providing men's fashion enthusiasts with an extensive selection of high-quality clothing, including traditional shalwar kameez, contemporary shirts, comfortable pents, and accessories. We combine the elegance of traditional Pakistani fashion with modern design aesthetics to create unique collections that cater to diverse tastes and occasions.
          </p>
          <p>
            Founded with a vision to transform the online fashion shopping experience, Menz brings together innovation, quality, and customer-centricity. Our platform serves as a bridge between skilled artisans and fashion-conscious consumers, ensuring that every piece reflects exceptional craftsmanship and attention to detail.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose Menz?</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">👔</div>
            <h3>Premium Quality</h3>
            <p>Carefully selected fabrics and meticulous craftsmanship ensure every garment meets our rigorous quality standards.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🎨</div>
            <h3>Curated Collections</h3>
            <p>Our expert team continuously curates collections that blend traditional Pakistani aesthetics with modern fashion trends.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">💚</div>
            <h3>Sustainable Practices</h3>
            <p>We are committed to eco-friendly sourcing and ethical manufacturing practices that respect our environment and communities.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>Seamless Shopping</h3>
            <p>Our user-friendly platform provides a smooth, secure shopping experience with quick delivery and hassle-free returns.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Competitive Pricing</h3>
            <p>We offer exceptional value without compromising on quality, making premium fashion accessible to all.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🤝</div>
            <h3>Customer Support</h3>
            <p>Our dedicated support team is available 24/7 to assist you with any queries or concerns.</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-list">
          <div className="value-item">
            <h4>Integrity</h4>
            <p>We conduct our business with complete honesty and transparency, building trust with our customers and partners.</p>
          </div>
          <div className="value-item">
            <h4>Excellence</h4>
            <p>We continuously strive for excellence in every aspect of our business, from product selection to customer service.</p>
          </div>
          <div className="value-item">
            <h4>Innovation</h4>
            <p>We embrace innovation and continuously improve our platform to enhance the shopping experience.</p>
          </div>
          <div className="value-item">
            <h4>Responsibility</h4>
            <p>We are responsible stewards of our environment and committed to supporting the communities we serve.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Join the Menz Community</h2>
        <p>Experience the perfect blend of tradition and contemporary style. Start exploring our collections today and discover fashion that tells your story.</p>
        <a href="/" className="cta-button">Shop Now</a>
      </section>
    </div>
  )
}

export default About
