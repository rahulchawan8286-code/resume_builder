import { apiClient } from './apiClient';

export const subjectService = {
  getAllSubjects: async () => {
    const res = await apiClient.get('/subjects');
    return res.data.data;
  }
};
