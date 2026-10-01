import api from '../api/axios';

const reportService = {
  getMonthly: async (month) => {
    const params = month ? { month } : {};
    const response = await api.get('/reports/monthly', { params });
    return response.data;
  },

  getSixMonths: async () => {
    const response = await api.get('/reports/six-months');
    return response.data;
  },

  getDaily: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/reports/daily', { params });
    return response.data;
  },

  getWeekly: async (weeks = 4) => {
    const response = await api.get('/reports/weekly', { params: { weeks } });
    return response.data;
  },

  getCategory: async (startDate, endDate, type = 'expense') => {
    const params = { type };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/reports/category', { params });
    return response.data;
  },

  getForecast: async () => {
    const response = await api.get('/reports/forecast');
    return response.data;
  },

  exportPDF: async (month) => {
    const params = month ? { month } : {};
    const response = await api.get('/reports/export', {
      params,
      responseType: 'blob' // Needed for binary PDF stream download
    });
    return response.data;
  }
};

export default reportService;
