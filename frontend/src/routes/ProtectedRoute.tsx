import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();
  if (loading) {
    return <p className="text-purple-200">Loading…</p>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
