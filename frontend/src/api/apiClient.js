import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  
  // Prevent infinite refresh loop by checking if we already retried or if the failed request was a refresh attempt itself
  if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh-token')) {
    originalRequest._retry = true;
    try {
      // Backend reads refreshToken from cookie directly
      await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
      return apiClient(originalRequest);
    } catch (refreshError) {
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});