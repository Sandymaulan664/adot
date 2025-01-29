// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ onLogout, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLogout={onLogout} /> 
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{display: 'fixed'}}>
        <Sidebar />
        </div>
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>

  );
};

export default Layout;
