// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/api/auth/login/`,
    REGISTER: `${API_BASE}/api/auth/register/`,
    LOGOUT: `${API_BASE}/api/auth/logout/`,
  },
  PRODUCTS: {
    LIST: `${API_BASE}/api/products/`,
    DETAIL: (id) => `${API_BASE}/api/products/${id}/`,
  },
  CART: {
    LIST: `${API_BASE}/api/cart/`,
    ADD: `${API_BASE}/api/cart/add/`,
    REMOVE: `${API_BASE}/api/cart/remove/`,
  },
  WISHLIST: {
    LIST: `${API_BASE}/api/wishlist/`,
    ADD: `${API_BASE}/api/wishlist/add/`,
    REMOVE: (id) => `${API_BASE}/api/wishlist/remove/${id}/`,
  },
  ORDERS: {
    LIST: `${API_BASE}/api/orders/`,
    DETAIL: (id) => `${API_BASE}/api/orders/${id}/`,
  },
}

export const apiClient = {
  get: async (url, headers = {}) => {
    const token = localStorage.getItem('token')
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
    }).then((res) => res.json())
  },

  post: async (url, data, headers = {}) => {
    const token = localStorage.getItem('token')
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  },

  put: async (url, data, headers = {}) => {
    const token = localStorage.getItem('token')
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  },

  delete: async (url, headers = {}) => {
    const token = localStorage.getItem('token')
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
    }).then((res) => res.json())
  },
}
