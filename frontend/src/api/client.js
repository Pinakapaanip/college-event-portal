import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only show error notifications for 401/403 auth errors, not generic failures
    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response?.data?.message || 'Authentication failed.';
      window.dispatchEvent(new CustomEvent('portal-notification', { detail: { type: 'error', message } }));
    }
    return Promise.reject(error);
  }
);

export default api;
