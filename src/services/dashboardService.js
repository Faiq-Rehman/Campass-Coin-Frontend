import api from '../api/axios';

const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};

export default dashboardService;
