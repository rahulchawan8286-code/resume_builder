import { apiClient } from './apiClient';

export const readinessService = {
  getReadiness: async () => {
    const response = await apiClient.get('/readiness');
    return response.data;
  },
  calculateReadiness: async () => {
    const response = await apiClient.post('/readiness/calculate');
    return response.data;
  },
  getAnalysis: async () => {
    const response = await apiClient.get('/readiness/analysis');
    return response.data;
  },
  generateAiAnalysis: async () => {
    const response = await apiClient.post('/readiness/ai-analysis');
    return response.data;
  }
};
