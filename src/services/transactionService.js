import api from '../api/axios';

const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/transactions/summary');
    return response.data;
  },

  getMonthly: async () => {
    const response = await api.get('/transactions/monthly');
    return response.data;
  },

  suggestCategory: async (description, type = 'expense') => {
    const response = await api.post('/transactions/suggest-category', { description, type });
    return response.data;
  },

  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/import/transactions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default transactionService;
