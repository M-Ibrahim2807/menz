import React, { createContext, useState, useEffect, useContext } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('user')

    if (token && userInfo) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userInfo))
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook to access auth context (preferred over useContext(AuthContext) in components)
export function useAuth() {
  return useContext(AuthContext)
}
