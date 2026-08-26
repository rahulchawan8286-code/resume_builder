import { apiClient } from './apiClient';

export const progressService = {
  getSubjectProgress: async (subjectId) => {
    const res = await apiClient.get(`/progress/subject/${subjectId}`);
    return res.data.data;
  },
  markChapterCompleted: async (subjectId, chapterId) => {
    const res = await apiClient.post(`/progress/subject/${subjectId}/complete`, { chapterId });
    return res.data.data;
  },
  saveMcqScore: async (subjectId, chapterId, score, total) => {
    const res = await apiClient.post(`/progress/subject/${subjectId}/mcq`, { chapterId, score, total });
    return res.data.data;
  }
};
