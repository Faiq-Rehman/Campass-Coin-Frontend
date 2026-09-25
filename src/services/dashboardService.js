import api from '../api/axios';

const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getSpendingTrends: async (timeframe = 'daily') => {
    const response = await api.get(`/dashboard/spending-trends?timeframe=${timeframe}`);
    return response.data;
  }
};

export default dashboardService;
