import { apiClient as api } from './apiClient';

export const companyService = {
  getCompanies: async (params) => {
    const res = await api.get('/company', { params });
    return res.data;
  },
  getCompanyById: async (id) => {
    const res = await api.get(`/company/${id}`);
    return res.data;
  },
  getBookmarks: async () => {
    const res = await api.get('/company/bookmarks');
    return res.data;
  },
  addBookmark: async (id) => {
    const res = await api.post(`/company/${id}/bookmark`);
    return res.data;
  },
  removeBookmark: async (id) => {
    const res = await api.delete(`/company/${id}/bookmark`);
    return res.data;
  },
  getTargets: async () => {
    const res = await api.get('/company/targets');
    return res.data;
  },
  addTarget: async (id, status) => {
    const res = await api.post(`/company/${id}/target`, { status });
    return res.data;
  },
  removeTarget: async (id) => {
    const res = await api.delete(`/company/${id}/target`);
    return res.data;
  }
};
