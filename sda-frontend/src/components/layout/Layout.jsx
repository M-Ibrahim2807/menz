import React from 'react'
import Header from '../layout/Header/Header'
import Footer from '../layout/Footer/Footer'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
