import api from '../api/axios';

const budgetService = {
  getBudgets: async (month) => {
    const params = month ? { month } : {};
    const response = await api.get('/budgets', { params });
    return response.data;
  },

  getBudgetStatus: async (month) => {
    const params = month ? { month } : {};
    const response = await api.get('/budgets/status', { params });
    return response.data;
  },

  createBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  updateBudget: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  }
};

export default budgetService;
