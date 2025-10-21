import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supriety_access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await api.post('/auth/refresh');
        const newToken = refreshResponse.data.accessToken;
        if (newToken) {
          localStorage.setItem('supriety_access_token', newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('supriety_access_token');
        localStorage.removeItem('supriety_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
