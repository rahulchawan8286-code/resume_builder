import api from '../lib/axios';

export const authAPI = {
  register:           (data) => api.post('/auth/register', data),
  login:              (data) => api.post('/auth/login', data),
  logout:             ()     => api.post('/auth/logout'),
  getMe:              ()     => api.get('/auth/me'),
  forgotPassword:     (data) => api.post('/auth/forgot-password', data),
  resetPassword:      (token, data) => api.post(`/auth/reset-password/${token}`, data),
  verifyEmail:        (data) => api.post('/auth/verify-email', data),
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  refresh:            ()     => api.post('/auth/refresh'),
};
