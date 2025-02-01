import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';


const Layout = ({ onLogout, children }) => {
  const [open , setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar open={open} setOpen={setOpen} />
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
