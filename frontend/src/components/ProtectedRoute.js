// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userEmail, children }) => {
  if (!userEmail) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  return children; // If the user is logged in, render the children (protected page)
};

export default ProtectedRoute;
