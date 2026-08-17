import { apiClient as api } from './apiClient';

export const roadmapService = {
  getRoadmap: async (targetCompanyId = null) => {
    const params = targetCompanyId ? { targetCompanyId } : {};
    const res = await api.get('/roadmap', { params });
    return res.data;
  },
  generateRoadmap: async (targetCompanyId) => {
    const res = await api.post('/roadmap/generate', { targetCompanyId });
    return res.data;
  },
  updateTaskStatus: async (taskId, isCompleted) => {
    const res = await api.put(`/roadmap/tasks/${taskId}`, { isCompleted });
    return res.data;
  },
  getProgress: async (targetCompanyId = null) => {
    const params = targetCompanyId ? { targetCompanyId } : {};
    const res = await api.get('/roadmap/progress', { params });
    return res.data;
  },
  getSkillGaps: async (targetCompanyId = null) => {
    const params = targetCompanyId ? { targetCompanyId } : {};
    const res = await api.get('/roadmap/skill-gaps', { params });
    return res.data;
  }
};
