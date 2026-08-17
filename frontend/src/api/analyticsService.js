import { apiClient } from './apiClient';

export const analyticsService = {
  getOverview: async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },
  getAiInsight: async () => {
    const response = await apiClient.post('/analytics/ai-insight');
    return response.data;
  }
};
