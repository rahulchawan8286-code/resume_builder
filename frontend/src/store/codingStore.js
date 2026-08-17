import { create } from 'zustand';
import { codingService } from '../api/codingService';

export const useCodingStore = create((set, get) => ({
  problems: [],
  progress: null,
  history: [],
  filters: {
    difficulty: '',
    topic: '',
    search: ''
  },
  isLoading: false,
  error: null,

  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().fetchProblems();
  },

  fetchProblems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { difficulty, topic } = get().filters;
      const params = {};
      if (difficulty) params.difficulty = difficulty;
      if (topic) params.topic = topic;
      
      const data = await codingService.getProblems(params);
      set({ problems: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch problems', isLoading: false });
    }
  },

  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await codingService.getProgress();
      set({ progress: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch progress', isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await codingService.getSubmissionHistory();
      set({ history: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch history', isLoading: false });
    }
  }
}));
