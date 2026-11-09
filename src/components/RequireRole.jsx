import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireRole({ allowedRole, children }) {
  const { user } = useAuth();
  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}