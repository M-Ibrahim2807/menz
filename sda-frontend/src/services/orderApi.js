import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const orderApi = {
  placeOrder: async (payload) => {
    const response = await axiosInstance.post('/orders/place/', payload)
    return response.data
  },

  fetchOrder: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}/`)
    return response.data
  },

  fetchOrderHistory: async () => {
    const response = await axiosInstance.get('/orders/history/')
    return response.data
  },

  cancelOrder: async (orderId) => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel/`)
    return response.data
  },

  requestRefund: async (orderId) => {
    const response = await axiosInstance.post(`/orders/${orderId}/refund/`)
    return response.data
  },
}

export default orderApi
