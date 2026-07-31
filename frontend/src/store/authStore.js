import { create } from 'zustand';
import { tokenHelper } from '../utils/tokenHelper';

export const useAuthStore = create((set) => ({
  isAuthenticated: !!tokenHelper.getAccessToken(),
  user: null,
  login: (token, user) => {
    tokenHelper.setAccessToken(token);
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    tokenHelper.clearTokens();
    set({ isAuthenticated: false, user: null });
  },
}));