import axios from 'axios';

// Create an Axios instance with a dynamic base URL.
// In production (Render), this will be relative to the domain (e.g., /api).
// In local dev, we will proxy /api to http://localhost:3000 via Vite.
const api = axios.create({
    baseURL: '/api'
});

// Add interceptor to attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
