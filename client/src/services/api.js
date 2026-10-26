import axios from 'axios';

// Automatically ensure base URL ends with /api without duplicate slashes
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 45000, // Render free tier spins down on inactivity; allow up to 45s for spin up
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('coaching_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch auth failures globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login if unauthorized
      localStorage.removeItem('coaching_token');
      localStorage.removeItem('coaching_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
