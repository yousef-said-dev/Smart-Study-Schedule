import { api } from './api';

const authService = {
  login: (email, password) => {
    console.log('logging in');
    return api.post('/auth/login', { email, password });
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  getMe: () => {
    return api.get('/auth/me');
  },

  updatePreferences: (preferences) => {
    return api.patch('/auth/preferences', preferences);
  },
};

export default authService;