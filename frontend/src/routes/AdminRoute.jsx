import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
};