import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signup: (data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) => api.post('/auth/signup', data),

  login: (data: { emailOrUsername: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// Acts API
export const actsAPI = {
  create: (data: FormData) =>
    api.post('/acts', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMyActs: (status?: string) =>
    api.get('/acts/my-acts', { params: { status } }),

  getCommunityFeed: (params?: {
    filter?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/acts/feed', { params }),

  getById: (id: string) => api.get(`/acts/${id}`),

  react: (actId: string, reaction_type: string) =>
    api.post(`/acts/${actId}/react`, { reaction_type }),

  unreact: (actId: string) => api.delete(`/acts/${actId}/react`),

  comment: (actId: string, comment_text: string) =>
    api.post(`/acts/${actId}/comment`, { comment_text }),
};

// User API
export const userAPI = {
  getProfile: (username: string) => api.get(`/users/${username}`),

  getLeaderboard: (params?: { period?: string; limit?: number }) =>
    api.get('/users/leaderboard', { params }),

  updateProfile: (data: FormData) =>
    api.patch('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),

  getPendingActs: () => api.get('/admin/pending-acts'),

  verifyAct: (actId: string) => api.post(`/admin/acts/${actId}/verify`),

  rejectAct: (actId: string, rejection_reason: string) =>
    api.post(`/admin/acts/${actId}/reject`, { rejection_reason }),

  getAllUsers: (params?: { limit?: number; offset?: number }) =>
    api.get('/admin/users', { params }),
};
