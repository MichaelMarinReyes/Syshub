import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // La URL por defecto de tu NestJS
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para enviar el Token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;