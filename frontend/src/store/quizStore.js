import { create } from 'zustand';
export const useQuizStore = create((set) => ({
  activeQuiz: null,
  setActiveQuiz: (quiz) => set({ activeQuiz: quiz }),
}));