import api from '../lib/axios';

export const resumeAPI = {
  getAll:         ()         => api.get('/resumes'),
  getById:        (id)       => api.get(`/resumes/${id}`),
  create:         (data)     => api.post('/resumes', data),
  update:         (id, data) => api.put(`/resumes/${id}`, data),
  delete:         (id)       => api.delete(`/resumes/${id}`),
  duplicate:      (id)       => api.post(`/resumes/${id}/duplicate`),
  changeStatus:   (id, data) => api.post(`/resumes/${id}/status`, data),
  saveVersion:    (id)       => api.post(`/resumes/${id}/version`),
  getHistory:     (id)       => api.get(`/resumes/${id}/history`),
  restoreVersion: (id, data) => api.post(`/resumes/${id}/restore`, data),
};

export const aiAPI = {
  generateObjective:  (data) => api.post('/ai/objective', data),
  generateSummary:    (data) => api.post('/ai/summary', data),
  enhanceExperience:  (data) => api.post('/ai/experience', data),
  analyzeAts:         (data) => api.post('/ai/ats', data),
  grammarCheck:       (data) => api.post('/ai/grammar', data),
  generateCoverLetter:(data) => api.post('/ai/cover-letter', data),
  getHistory:         ()     => api.get('/ai/history'),
  deleteHistory:      (id)   => api.delete(`/ai/history/${id}`),
};

export const pdfAPI = {
  generate: (data)     => api.post('/pdf/generate', data, { responseType: 'blob' }),
  preview:  (resumeId) => api.get(`/pdf/${resumeId}`,   { responseType: 'blob' }),
  print:    (data)     => api.post('/pdf/print', data,  { responseType: 'blob' }),
};

export const uploadAPI = {
  profilePhoto: (formData) => api.post('/upload/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  resumeImage: (formData) => api.post('/upload/resume-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteFile: (encodedId) => api.delete(`/upload/${encodedId}`),
};
