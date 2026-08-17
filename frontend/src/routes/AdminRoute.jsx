import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

export const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return null; // AuthProvider handles the main loading spinner
  }
  
  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
};