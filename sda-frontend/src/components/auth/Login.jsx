import React from 'react';
import { AuthContext } from '../../services/AuthService';

class Login extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username_or_email: '',
        password: '',
      },
      errors: {},
      isLoading: false,
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

    if (!formData.username_or_email) {
      errors.username_or_email = 'Username or Email is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
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

    this.setState({ isLoading: true, errors: {} });

    try {
      await this.context.login(this.state.formData);
      // Redirect to dashboard or home page after successful login
      window.location.href = '/';
    } catch (error) {
      this.setState({
        errors: { 
          submit: error.message || 'Login failed. Please check your credentials.' 
        }
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { formData, errors, isLoading } = this.state;

    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Sign In</h1>

          <form onSubmit={this.handleSubmit} className="auth-form">
            {/* Username or Email Field */}
            <div className="form-group">
              <label htmlFor="username_or_email" className="form-label">
                Username or Email
              </label>
              <input
                id="username_or_email"
                type="text"
                className={`form-input ${errors.username_or_email ? 'error' : ''}`}
                placeholder="Enter username or email"
                value={formData.username_or_email}
                onChange={(e) => this.handleInputChange('username_or_email', e.target.value)}
              />
              {errors.username_or_email && (
                <span className="error-text">{errors.username_or_email}</span>
              )}
            </div>

            {/* Password Field */}
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

            {/* Divider */}
            <div className="divider"></div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'SIGN IN'}
            </button>

            {errors.submit && (
              <div className="error-text text-center">{errors.submit}</div>
            )}

            {/* Register Link */}
            <div className="auth-link">
              Don't have an account? <a href="/register" className="link">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;