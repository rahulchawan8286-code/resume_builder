import { create } from 'zustand';
export const useResumeStore = create((set) => ({
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),
}));