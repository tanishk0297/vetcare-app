import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '2px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
