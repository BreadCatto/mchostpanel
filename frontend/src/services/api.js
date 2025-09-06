import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
};

export const serverAPI = {
  getServers: () => api.get('/api/servers/'),
  createServer: (serverData) => api.post('/api/servers/', serverData),
  getServer: (serverId) => api.get(`/api/servers/${serverId}`),
  deleteServer: (serverId) => api.delete(`/api/servers/${serverId}`),
  startServer: (serverId) => api.post(`/api/servers/${serverId}/start`),
  stopServer: (serverId) => api.post(`/api/servers/${serverId}/stop`),
  restartServer: (serverId) => api.post(`/api/servers/${serverId}/restart`),
};

export default api;