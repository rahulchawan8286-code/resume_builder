import { create } from 'zustand';
import { readinessService } from '../api/readinessService';

export const useDashboardStore = create((set, get) => ({
  readinessData: null,
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchDashboardData: async (force = false) => {
    // Avoid refetching if already fetched successfully unless forced
    if (get().hasFetched && !force) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await readinessService.getReadiness();
      // If there's no readiness document for the user yet, data might be null or missing
      // API typically wraps in { success: true, data: { ... } }
      set({ 
        readinessData: response.data || null, 
        isLoading: false, 
        hasFetched: true 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to load dashboard data', 
        isLoading: false 
      });
    }
  },

  retry: () => get().fetchDashboardData(true)
}));
