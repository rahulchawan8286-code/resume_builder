import axios from 'axios';
import { tokenHelper } from '../utils/tokenHelper';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenHelper.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshToken = tokenHelper.getRefreshToken();
      const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, { token: refreshToken });
      if (res.data.accessToken) {
        tokenHelper.setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return apiClient(originalRequest);
      }
    } catch (refreshError) {
      tokenHelper.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});