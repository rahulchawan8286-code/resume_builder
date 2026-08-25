import { apiClient } from './apiClient';

export const codingService = {
  getProblems: async (params = {}) => {
    const response = await apiClient.get('/coding/problems', { params });
    return response.data.data;
  },

  getProblemById: async (id) => {
    const response = await apiClient.get(`/coding/problems/${id}`);
    return response.data.data;
  },

  submitCode: async (id, language, code) => {
    const response = await apiClient.post(`/coding/problems/${id}/submit`, { language, code });
    return response.data;
  },

  getProgress: async () => {
    const response = await apiClient.get('/coding/progress');
    return response.data.data;
  },

  getSubmissionHistory: async () => {
    const response = await apiClient.get('/coding/history');
    return response.data.data;
  }
};
