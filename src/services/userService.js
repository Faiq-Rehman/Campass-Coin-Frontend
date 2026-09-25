import api from '../api/axios';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.put('/users/change-password', passwords);
    return response.data;
  }
};

export default userService;
