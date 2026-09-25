import axios from 'axios';

// Live Railway backend base URL configuration
let rawBase = (import.meta.env.VITE_API_URL || 'https://campass-coin-backend-production.up.railway.app').trim();

// Ensure protocol is present
if (!rawBase.startsWith('http://') && !rawBase.startsWith('https://')) {
  rawBase = `https://${rawBase}`;
}

// Guarantee trailing slash is stripped and /api route prefix is intact
rawBase = rawBase.replace(/\/+$/, '');
const cleanBaseURL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30s timeout for live server
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

// Response Interceptor: Friendly error extraction & session handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // If session has expired or token is invalid on a protected route, safely clear stale token
    if (status === 401 && !url.includes('/login') && !url.includes('/register')) {
      if (url.startsWith('/admin')) {
        localStorage.removeItem('campus_coin_admin_token');
        localStorage.removeItem('campus_coin_admin_user');
      } else {
        localStorage.removeItem('campus_coin_token');
        localStorage.removeItem('campus_coin_user');
      }
    }

    // Format error message cleanly from backend response
    let message =
      error.response?.data?.message ||
      (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
      error.message ||
      'Unable to connect to the live server. Please check your internet connection.';

    // If network error
    if (error.code === 'ERR_NETWORK') {
      message = 'Live backend is currently unreachable. Please check your internet or retry in a few moments.';
    }

    const customError = new Error(message);
    customError.status = status;
    customError.errors = error.response?.data?.errors;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default api;
