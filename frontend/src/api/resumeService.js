import apiClient from './apiClient';

export const resumeService = {
  getTemplates: async () => {
    const response = await apiClient.get('/resume/templates');
    return response.data.data;
  },
  
  getResumes: async () => {
    const response = await apiClient.get('/resume');
    return response.data.data;
  },
  
  getResumeById: async (id) => {
    const response = await apiClient.get(`/resume/${id}`);
    return response.data.data;
  },
  
  createResume: async (data) => {
    const response = await apiClient.post('/resume', data);
    return response.data.data;
  },
  
  updateResume: async (id, data) => {
    const response = await apiClient.put(`/resume/${id}`, data);
    return response.data.data;
  },
  
  deleteResume: async (id) => {
    const response = await apiClient.delete(`/resume/${id}`);
    return response.data;
  },
  
  duplicateResume: async (id) => {
    const response = await apiClient.post(`/resume/${id}/duplicate`);
    return response.data.data;
  },
  
  getATSReport: async (id) => {
    const response = await apiClient.get(`/resume/${id}/ats`);
    return response.data.data;
  },
  
  analyzeATS: async (id, targetRole) => {
    const response = await apiClient.post(`/resume/${id}/analyze`, { targetRole });
    return response.data.data;
  }
};
