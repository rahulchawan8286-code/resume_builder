import { create } from 'zustand';
import { storageHelper } from '../utils/storageHelper';
import { STORAGE_KEYS } from '../constants/storage';
import { THEME } from '../constants/theme';

export const useThemeStore = create((set) => ({
  theme: storageHelper.get(STORAGE_KEYS.THEME) || THEME.LIGHT,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
    storageHelper.set(STORAGE_KEYS.THEME, newTheme);
    return { theme: newTheme };
  }),
}));