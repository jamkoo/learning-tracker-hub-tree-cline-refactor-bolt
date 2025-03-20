import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to Dashboard or Login based on authentication state
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  return isAdminLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
