// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Jika tidak terautentikasi, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika terautentikasi, tampilkan komponen anak
  return children;
};

export default ProtectedRoute;
