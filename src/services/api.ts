import axios from 'axios';
import type { CreateDriverData, Driver, UpdateDriverData } from '../types';


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para adicionar o Token automaticamente quando logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se der 401 (Não autorizado), pode ser token vencido.
      // Opcional: localStorage.removeItem('token');
      //alterar
      // Opcional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const driverService = {
  create: async(driverData: CreateDriverData): Promise<Driver> => {
    try {
      const token = localStorage.getItem('token');
      console.log('Chave usada:', 'token');
      console.log('Token bruto:', token);
      console.log('Header montado:', `Bearer ${token}`);
      // --- FIM DEBUG ---

      if (!token) {
        throw new Error('Usuário não autenticado (Token vazio)');
      }
      const response = await api.post<Driver>('/drivers',
        driverData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      return response.data;    
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      throw error;
    }
  }, 
  update: async (id: string, driverData: UpdateDriverData): Promise<Driver> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.put<Driver>(`/drivers/${id}`, driverData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar motorista:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      await api.delete(`/drivers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      throw error;
    }
  },
};