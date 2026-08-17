import { create } from 'zustand';
import { resumeService } from '../api/resumeService';
import debounce from 'lodash/debounce';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  templates: [],
  currentResume: null,
  atsReport: null,
  isLoading: false,
  isSaving: false,
  saveStatus: 'idle', // idle | saving | saved | error
  error: null,

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const resumes = await resumeService.getResumes();
      set({ resumes, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resumes', isLoading: false });
    }
  },

  fetchTemplates: async () => {
    try {
      const templates = await resumeService.getTemplates();
      set({ templates });
    } catch (error) {
      console.error('Failed to fetch templates', error);
    }
  },

  fetchResumeById: async (id) => {
    set({ isLoading: true, error: null, currentResume: null, atsReport: null });
    try {
      const currentResume = await resumeService.getResumeById(id);
      set({ currentResume, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resume', isLoading: false });
    }
  },

  createResume: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newResume = await resumeService.createResume(data);
      set(state => ({ resumes: [newResume, ...state.resumes], currentResume: newResume, isLoading: false }));
      return newResume;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create resume', isLoading: false });
      throw error;
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await resumeService.deleteResume(id);
      set(state => ({
        resumes: state.resumes.filter(r => r._id !== id),
        currentResume: state.currentResume?._id === id ? null : state.currentResume,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete resume', isLoading: false });
      throw error;
    }
  },

  duplicateResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const duplicate = await resumeService.duplicateResume(id);
      set(state => ({ resumes: [duplicate, ...state.resumes], isLoading: false }));
      return duplicate;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to duplicate resume', isLoading: false });
      throw error;
    }
  },

  fetchATSReport: async (id) => {
    try {
      const report = await resumeService.getATSReport(id);
      set({ atsReport: report });
    } catch (error) {
      set({ atsReport: null });
    }
  },

  analyzeATS: async (id, targetRole) => {
    set({ isLoading: true, error: null });
    try {
      const report = await resumeService.analyzeATS(id, targetRole);
      set({ atsReport: report, isLoading: false });
      return report;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to analyze resume', isLoading: false });
      throw error;
    }
  },

  // Autosave logic
  debouncedUpdate: debounce(async (id, data, cb) => {
    try {
      await resumeService.updateResume(id, data);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }, 1000),

  updateCurrentResumeLocal: (data) => {
    // Update local state instantly for UI responsiveness
    set(state => ({
      currentResume: { ...state.currentResume, ...data },
      saveStatus: 'saving'
    }));

    // Trigger API call debounced
    const { currentResume, debouncedUpdate } = get();
    if (currentResume?._id) {
      debouncedUpdate(currentResume._id, data, (err) => {
        if (err) {
          set({ saveStatus: 'error', error: err.response?.data?.message || 'Failed to save' });
        } else {
          set({ saveStatus: 'saved' });
          setTimeout(() => {
            if (get().saveStatus === 'saved') set({ saveStatus: 'idle' });
          }, 2000);
        }
      });
    }
  }
}));