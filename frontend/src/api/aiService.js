import { apiClient as api } from './apiClient';

export const aiService = {
  getCareerInsights: async () => {
    const response = await api.get('/ai/career-analysis');
    return response.data;
  },
  refreshCareerInsights: async () => {
    const response = await api.post('/ai/career-analysis/refresh');
    return response.data;
  }
};
