import axios from 'axios';

const API = axios.create({
  baseURL: 'https://modernbakery.shop/api', // Backend server is running on port 3000 and /api prefix
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default API;
