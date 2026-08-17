import { apiClient } from './apiClient';

export const interviewService = {
  startSession: async (sessionType, difficulty, targetCompanyId = null) => {
    const response = await apiClient.post('/interviews/start', { sessionType, difficulty, targetCompanyId });
    return response.data;
  },
  getSessions: async () => {
    const response = await apiClient.get('/interviews');
    return response.data;
  },
  getSession: async (id) => {
    const response = await apiClient.get(`/interviews/${id}`);
    return response.data;
  },
  submitAnswer: async (sessionId, questionId, answer) => {
    const response = await apiClient.post(`/interviews/${sessionId}/answer`, { questionId, answer });
    return response.data;
  },
  finishSession: async (sessionId) => {
    const response = await apiClient.post(`/interviews/${sessionId}/finish`);
    return response.data;
  },
  getPerformance: async () => {
    const response = await apiClient.get('/interviews/performance');
    return response.data;
  }
};
