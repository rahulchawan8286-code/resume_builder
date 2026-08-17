import { apiClient } from './apiClient';

export const quizService = {
  getQuizzes: async (subjectId = '') => {
    const query = subjectId ? `?subject=${subjectId}` : '';
    const res = await apiClient.get(`/quizzes${query}`);
    return res.data.data;
  },

  getQuizQuestions: async (quizId) => {
    const res = await apiClient.get(`/quizzes/${quizId}/questions`);
    return res.data.data; // { quiz, questions }
  },

  submitQuiz: async (quizId, answers) => {
    const res = await apiClient.post(`/quizzes/${quizId}/submit`, { answers });
    return res.data.data;
  }
};
