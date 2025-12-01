import React from 'react';
import BaseService from './BaseService';

class AuthService extends BaseService {
  async register(userData) {
    return this.post('/register/', userData);
  }

  async login(credentials) {
    return this.post('/login/', credentials);
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

const AuthContext = React.createContext();

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      user: this.authService.getCurrentUser(),
      isAuthenticated: this.authService.isAuthenticated(),
      login: this.login.bind(this),
      logout: this.logout.bind(this),
      register: this.register.bind(this),
    };
  }

  async login(credentials) {
    try {
      const response = await this.authService.login(credentials);
      localStorage.setItem('token', response.tokens.access);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        user: response.user,
        isAuthenticated: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.authService.register(userData);
      localStorage.setItem('token', response.tokens.access);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        user: response.user,
        isAuthenticated: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.authService.logout();
    this.setState({
      user: null,
      isAuthenticated: false,
    });
  }

  render() {
    return React.createElement(
      AuthContext.Provider,
      { value: this.state },
      this.props.children
    );
  }
}

export { AuthService, AuthProvider, AuthContext };