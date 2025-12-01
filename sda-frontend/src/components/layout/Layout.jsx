import React from 'react';
import Header from './Header';
import Footer from './Footer';

class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <Header />
        <main className="main-content">
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}

export default Layout;