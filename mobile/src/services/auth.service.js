import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', { ...userData, role: 'tenant' });
    return res.data.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },
};

export default authService;
