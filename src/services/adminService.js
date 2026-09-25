import api from '../api/axios';

const adminService = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createDefaultCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateDefaultCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteDefaultCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get('/admin/announcements');
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post('/admin/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id, announcementData) => {
    const response = await api.put(`/admin/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/admin/announcements/${id}`);
    return response.data;
  }
};

export default adminService;
