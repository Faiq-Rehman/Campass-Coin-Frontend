import api from '../api/axios';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resendResetCode: async (data) => {
    const response = await api.post('/auth/resend-reset-code', data);
    return response.data;
  },

  verifyResetCode: async (data) => {
    const response = await api.post('/auth/verify-reset-code', data);
    return response.data;
  },

  resetPassword: async (token, data) => {
    const response = await api.post(`/auth/reset-password/${token}`, data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }
};

export default authService;
