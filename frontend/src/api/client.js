import axios from 'axios';

function resolveApiBaseUrl() {
  const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5050').replace(/\/+$/, '');
  return rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response?.data?.message || 'Authentication failed.';
      window.dispatchEvent(new CustomEvent('portal-notification', { detail: { type: 'error', message } }));
    }
    return Promise.reject(error);
  }
);

export default api;
