import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);
