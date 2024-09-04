import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" />;
  }

  console.log("Token found, allowing access.");
  return children;
};

export default PrivateRoute;
