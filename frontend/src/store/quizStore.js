import { create } from 'zustand';

export const useQuizStore = create((set, get) => ({
  activeQuiz: null,
  questions: [],
  answers: {}, // { questionId: selectedOptionId }
  timeRemaining: 0,
  timerInterval: null,
  isSubmitting: false,

  startQuiz: (quizData, questionsData) => {
    // Clear any existing timer
    const currentTimer = get().timerInterval;
    if (currentTimer) clearInterval(currentTimer);

    set({
      activeQuiz: quizData,
      questions: questionsData,
      answers: {},
      timeRemaining: quizData.timeLimit * 60, // minutes to seconds
      isSubmitting: false,
      timerInterval: null
    });
  },

  setAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionId
      }
    }));
  },

  decrementTime: () => {
    set((state) => {
      if (state.timeRemaining <= 0) return { timeRemaining: 0 };
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },

  setTimerInterval: (interval) => set({ timerInterval: interval }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  clearQuiz: () => {
    const currentTimer = get().timerInterval;
    if (currentTimer) clearInterval(currentTimer);
    set({
      activeQuiz: null,
      questions: [],
      answers: {},
      timeRemaining: 0,
      timerInterval: null,
      isSubmitting: false
    });
  }
}));