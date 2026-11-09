import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user.role === 'guest') {
    return <Navigate to="/login" replace />;
  }
  return children;
}