import api from '../api/axios';

const authService = {
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  forgotPassword: async (data) => (await api.post('/auth/forgot-password', data)).data,
  verifySecurityAnswers: async (data) => (await api.post('/auth/verify-security-answers', data)).data,
  resetPassword: async (token, data) => (await api.post(`/auth/reset-password/${token}`, data)).data,
  getMe: async () => (await api.get('/auth/me')).data,
};

export default authService;
