import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const useAuthStore = create((set) => ({
  isAuthenticated: false, // We must verify with backend first
  user: null,
  isLoading: true, // Initially true to show loading while checking auth
  error: null,
  
  // Set auth state directly (called after login/register)
  setAuth: ({ user }) => {
    set({ isAuthenticated: true, user, isLoading: false, error: null });
  },

  // Initialize auth on app load
  initAuth: async () => {
    set({ isLoading: true });
    try {
      // Fetch user profile to verify session cookie and get user data
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      set({ 
        isAuthenticated: true, 
        user: response.data.user || response.data.data?.user || response.data, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      // If session is invalid/expired (and refresh failed in interceptor)
      set({ isAuthenticated: false, user: null, isLoading: false, error: 'Session expired' });
    }
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ isAuthenticated: false, user: null });
      // Force reload to clear all states and caches
      window.location.href = '/login';
    }
  },
  
  setError: (error) => set({ error }),
}));