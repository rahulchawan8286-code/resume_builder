import { apiClient } from './apiClient';

export const resultService = {
  getUserResults: async () => {
    const res = await apiClient.get('/results');
    return res.data.data;
  },

  getResultById: async (id) => {
    const res = await apiClient.get(`/results/${id}`);
    return res.data.data;
  }
};
