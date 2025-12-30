import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Sua API NestJS
});

// Interceptor para adicionar o Token automaticamente quando logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});