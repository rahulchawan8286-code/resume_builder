import { create } from 'zustand';
import { aiService } from '../api/aiService';
import { toast } from 'sonner';

export const useAiStore = create((set) => ({
  insights: null,
  emptyState: false,
  emptyMessage: '',
  cached: false,
  lastAnalyzedAt: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await aiService.getCareerInsights();
      if (res.data.emptyState) {
        set({ emptyState: true, emptyMessage: res.data.message, isLoading: false });
      } else {
        set({ 
          insights: res.data.data, 
          emptyState: false, 
          cached: res.data.cached, 
          lastAnalyzedAt: res.data.lastAnalyzedAt,
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'AI analysis is temporarily unavailable. Please try again later.', 
        isLoading: false 
      });
    }
  },

  refreshInsights: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const res = await aiService.refreshCareerInsights();
      if (res.data.emptyState) {
        set({ emptyState: true, emptyMessage: res.data.message, isRefreshing: false });
        toast('Complete more assessments to generate insights');
      } else {
        set({ 
          insights: res.data.data, 
          emptyState: false, 
          cached: res.data.cached, 
          lastAnalyzedAt: res.data.lastAnalyzedAt,
          isRefreshing: false 
        });
        toast.success('AI analysis refreshed based on latest data.');
      }
    } catch (error) {
      set({ isRefreshing: false });
      toast.error('AI analysis refresh failed. Try again later.');
    }
  }
}));
