import api from '../api/axios';

const tipService = {
  getTips: async () => {
    const response = await api.get('/tips');
    return response.data;
  },

  generateTips: async () => {
    const response = await api.post('/tips/generate');
    return response.data;
  },

  pinTip: async (id) => {
    const response = await api.post(`/tips/${id}/pin`);
    return response.data;
  },

  dismissTip: async (id) => {
    const response = await api.post(`/tips/${id}/dismiss`);
    return response.data;
  }
};

export default tipService;
