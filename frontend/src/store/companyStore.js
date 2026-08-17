import { create } from 'zustand';
import { companyService } from '../api/companyService';

export const useCompanyStore = create((set, get) => ({
  companies: [],
  currentCompany: null,
  bookmarks: [],
  targets: [],
  isLoading: false,
  error: null,

  fetchCompanies: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await companyService.getCompanies(params);
      set({ companies: res.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch companies', isLoading: false });
    }
  },

  fetchCompanyById: async (id) => {
    set({ isLoading: true, error: null, currentCompany: null });
    try {
      const res = await companyService.getCompanyById(id);
      set({ currentCompany: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch company details', isLoading: false });
    }
  },

  fetchBookmarks: async () => {
    try {
      const res = await companyService.getBookmarks();
      set({ bookmarks: res.data || [] });
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    }
  },

  toggleBookmark: async (companyId) => {
    const { bookmarks } = get();
    const isBookmarked = bookmarks.some(b => b.company._id === companyId);
    
    try {
      if (isBookmarked) {
        await companyService.removeBookmark(companyId);
        set({ bookmarks: bookmarks.filter(b => b.company._id !== companyId) });
      } else {
        await companyService.addBookmark(companyId);
        // Optimistically add just the id since full populate might be missing in return, or just refetch
        get().fetchBookmarks();
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
      throw err;
    }
  },

  fetchTargets: async () => {
    try {
      const res = await companyService.getTargets();
      set({ targets: res.data || [] });
    } catch (err) {
      console.error('Failed to fetch targets', err);
    }
  },

  updateTarget: async (companyId, status) => {
    try {
      await companyService.addTarget(companyId, status);
      get().fetchTargets();
    } catch (err) {
      console.error('Failed to update target', err);
      throw err;
    }
  },

  removeTarget: async (companyId) => {
    try {
      await companyService.removeTarget(companyId);
      get().fetchTargets();
    } catch (err) {
      console.error('Failed to remove target', err);
      throw err;
    }
  }
}));
