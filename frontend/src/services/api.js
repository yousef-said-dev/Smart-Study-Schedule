import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`, {
        hasAuth: !!config.headers.Authorization,
        authPreview: config.headers.Authorization?.substring(0, 30) + '...'
      });
    } else {
      console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url} (no auth)`);
    }
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ [API Response Error]:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Handle specific errors
    if (error.message === 'Network Error') {
      toast.error('Cannot connect to backend. Is it running on port 5000?');
    } else if (error.response?.status === 401) {
      // Only auto-redirect if NOT on login/register pages (to avoid interfering with login flow)
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      if (!isAuthPage) {
        toast.error('Unauthorized: Invalid credentials or expired session');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
      // If on auth page, let the component handle the error
    } else if (error.response?.status === 404) {
      toast.error(`API endpoint not found: ${error.config?.url}`);
    } else {
      toast.error(error.response?.data?.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;