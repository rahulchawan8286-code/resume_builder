import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  notificationsOpen: false,
  commandPaletteOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
