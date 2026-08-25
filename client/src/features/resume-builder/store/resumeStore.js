import { create } from 'zustand';
import { temporal } from 'zundo';

const initialResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    profilePhoto: '',
  },
  objective: '',
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
  },
  certifications: [],
  languages: [],
};

const initialTheme = {
  template: 'modern',
  primaryColor: '#6366f1',
  accentColor: '#4f46e5',
  fontFamily: 'Inter',
  fontSize: '11pt',
  spacing: 'normal',
};

export const useResumeStore = create(
  temporal(
    (set, get) => ({
      resumeData: initialResumeData,
      theme: initialTheme,
      activeSection: 'personal',
      zoomLevel: 100,
      isSaving: false,
      lastSaved: null,

      // -- Actions --
      
      setResumeData: (data) => set({ resumeData: { ...get().resumeData, ...data } }),
      
      updatePersonalInfo: (info) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          personalInfo: { ...state.resumeData.personalInfo, ...info }
        }
      })),

      updateObjective: (objective) => set((state) => ({
        resumeData: { ...state.resumeData, objective }
      })),

      // Array Actions (Education, Experience, Projects)
      addItem: (section, item) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: [...state.resumeData[section], item]
        }
      })),

      updateItem: (section, id, updates) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: state.resumeData[section].map((item) => 
            item.id === id ? { ...item, ...updates } : item
          )
        }
      })),

      deleteItem: (section, id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: state.resumeData[section].filter((item) => item.id !== id)
        }
      })),

      reorderItems: (section, startIndex, endIndex) => set((state) => {
        const result = Array.from(state.resumeData[section]);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return {
          resumeData: {
            ...state.resumeData,
            [section]: result
          }
        };
      }),

      // UI Actions
      setActiveSection: (section) => set({ activeSection: section }),
      setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
      updateTheme: (themeUpdates) => set((state) => ({
        theme: { ...state.theme, ...themeUpdates }
      })),
      
      setSaveState: (isSaving, timestamp) => set({ 
        isSaving, 
        lastSaved: timestamp || get().lastSaved 
      }),

    }),
    {
      partialize: (state) => ({
        resumeData: state.resumeData,
        theme: state.theme,
      }),
      limit: 50, // Keep last 50 states for undo
    }
  )
);
