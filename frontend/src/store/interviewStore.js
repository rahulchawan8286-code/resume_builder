import { create } from 'zustand';
import { interviewService } from '../api/interviewService';
import { toast } from 'sonner';

export const useInterviewStore = create((set, get) => ({
  sessions: [],
  activeSession: null,
  performance: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  currentQuestionIndex: 0,

  startSession: async (sessionType, difficulty, targetCompanyId = null) => {
    set({ isLoading: true, error: null, currentQuestionIndex: 0 });
    try {
      const res = await interviewService.startSession(sessionType, difficulty, targetCompanyId);
      set({ activeSession: res.data, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      toast.error('Failed to start interview session');
      throw err;
    }
  },

  getSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.getSessions();
      set({ sessions: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  getSession: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.getSession(id);
      set({ activeSession: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  submitAnswer: async (questionId, answer) => {
    const { activeSession } = get();
    if (!activeSession) return;
    
    set({ isSubmitting: true, error: null });
    try {
      const res = await interviewService.submitAnswer(activeSession._id, questionId, answer);
      // Update the specific question in the active session
      const updatedQuestions = activeSession.questions.map(q => 
        q._id === questionId ? res.data : q
      );
      set({ 
        activeSession: { ...activeSession, questions: updatedQuestions }, 
        isSubmitting: false 
      });
      toast.success('Answer evaluated successfully');
    } catch (err) {
      // If validation fails or gemini fails, it might return 400 with the saved question
      if (err.response?.status === 400 && err.response?.data?.question) {
        const updatedQuestions = activeSession.questions.map(q => 
          q._id === questionId ? err.response.data.question : q
        );
        set({ 
          activeSession: { ...activeSession, questions: updatedQuestions }, 
          isSubmitting: false 
        });
        toast.error('Evaluation failed. You can retry.');
      } else {
        set({ error: err.response?.data?.message || err.message, isSubmitting: false });
        toast.error('Failed to submit answer');
      }
    }
  },

  finishSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;

    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.finishSession(activeSession._id);
      set({ activeSession: res.data, isLoading: false });
      toast.success('Interview completed!');
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      toast.error('Failed to finish interview');
      throw err;
    }
  },

  getPerformance: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await interviewService.getPerformance();
      set({ performance: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  setCurrentQuestionIndex: (index) => {
    set({ currentQuestionIndex: index });
  },

  clearActiveSession: () => {
    set({ activeSession: null, currentQuestionIndex: 0 });
  }
}));
