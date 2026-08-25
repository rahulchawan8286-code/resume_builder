import { apiClient } from './apiClient';

export const subjectService = {
  getAllSubjects: async () => {
    const res = await apiClient.get('/subjects');
    return res.data.data;
  },
  getSubjectById: async (id) => {
    const res = await apiClient.get(`/subjects/${id}`);
    return res.data.data;
  },
  getSubjectNotes: async (subjectId) => {
    const res = await apiClient.get(`/notes/subject/${subjectId}`);
    return res.data.data;
  }
};
