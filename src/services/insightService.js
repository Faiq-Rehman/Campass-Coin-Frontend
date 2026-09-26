import api from '../api/axios';

const insightService = {
  getCurrent: async () => {
    const response = await api.get('/insights/current');
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/insights/history');
    return response.data;
  },

  generate: async (month) => {
    const body = month ? { month } : {};
    const response = await api.post('/insights/generate', body);
    return response.data;
  }
};

export default insightService;
