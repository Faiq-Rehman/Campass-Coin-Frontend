import axios from 'axios';

// Live Railway backend base URL configured in frontend/.env
const rawBaseURL = import.meta.env.VITE_API_URL || 'https://campus-coin-backend.up.railway.app/api';

// Guarantee that trailing slashes are trimmed
const cleanBaseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000 // 20s network timeout
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    // Check if it's an admin request or normal user request
    const isAdminRoute = config.url && config.url.startsWith('/admin') && !config.url.startsWith('/admin/login');
    const token = isAdminRoute
      ? localStorage.getItem('campus_coin_admin_token') || localStorage.getItem('campus_coin_token')
      : localStorage.getItem('campus_coin_token') || localStorage.getItem('campus_coin_admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Friendly error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Format error message cleanly
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to the live server. Please check your internet connection.';

    // Attach human-readable message for UI components
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default api;
