import { create } from 'zustand';
export const useSettingsStore = create((set) => ({
  settings: {},
  setSettings: (settings) => set({ settings }),
}));