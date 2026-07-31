import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      }),

      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates },
      })),

      checkAuth: async () => {
        console.log('[authStore] checkAuth triggered, setting isLoading = true');
        set({ isLoading: true });
        try {
          const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
          console.log(`[authStore] Executing axios.post to ${baseURL}/auth/refresh`);
          const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
          
          console.log('[authStore] Refresh success, setting user state', res.data.data?.user);
          set({
            user: res.data.data?.user || get().user,
            accessToken: res.data.data?.accessToken,
            isAuthenticated: true,
          });
        } catch (err) {
          console.log('[authStore] Refresh failed (catch error)', err.response?.status || err.message);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        } finally {
          console.log('[authStore] finally execution: setting isLoading = false');
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist user data, NOT the access token (lives in memory + cookie)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
