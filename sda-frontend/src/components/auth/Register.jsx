import React from 'react';
import { AuthContext } from '../../services/AuthService';

class Register extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        phone: '',
        address: ''
      },
      errors: {},
      isLoading: false,
      successMessage: ''
    };
  }

  handleInputChange = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
      errors: {
        ...prevState.errors,
        [field]: '',
      },
    }));
  };

  validateForm() {
    const { formData } = this.state;
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.password_confirm) {
      errors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.address) {
      errors.address = 'Address is required';
    }

    return errors;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ isLoading: true, errors: {}, successMessage: '' });

    try {
      await this.context.register(this.state.formData);
      this.setState({
        successMessage: 'Registration successful! Redirecting...',
        formData: {
          username: '',
          email: '',
          password: '',
          password_confirm: '',
          phone: '',
          address: ''
        }
      });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      this.setState({
        errors: { 
          submit: error.message || 'Registration failed. Please try again.' 
        }
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { formData, errors, isLoading, successMessage } = this.state;

    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Sign Up</h1>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="test@gmail.com"
                value={formData.email}
                onChange={(e) => this.handleInputChange('email', e.target.value)}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => this.handleInputChange('username', e.target.value)}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => this.handleInputChange('phone', e.target.value)}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => this.handleInputChange('address', e.target.value)}
                rows="3"
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="***********"
                value={formData.password}
                onChange={(e) => this.handleInputChange('password', e.target.value)}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirm" className="form-label">Confirm Password</label>
              <input
                id="password_confirm"
                type="password"
                className={`form-input ${errors.password_confirm ? 'error' : ''}`}
                placeholder="***********"
                value={formData.password_confirm}
                onChange={(e) => this.handleInputChange('password_confirm', e.target.value)}
              />
              {errors.password_confirm && <span className="error-text">{errors.password_confirm}</span>}
            </div>

            <div className="divider"></div>

            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'SIGN UP'}
            </button>

            {errors.submit && (
              <div className="error-text text-center">{errors.submit}</div>
            )}

            <div className="auth-link">
              Already have an account? <a href="/login" className="link">Sign In</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;