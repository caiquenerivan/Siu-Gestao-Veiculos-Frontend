import axios from 'axios';
import type { Driver } from '../types';
//import type { CreateDriverData, CreateOperatorData, CreateVehicleData, Driver, Operator, PaginatedResponse, UpdateDriverData, UpdateOperatorData, UpdateVehicleData, Vehicle } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: 'https://siu-backend.onrender.com',
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

export const profileService = {
  getAdminProfile: async(id: string): Promise<any> => {  
    try {
      const response = await api.get(`/admins/${id}`, {     
        headers: {      
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },    
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },
  getMe: async () => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
  getByUserId: async (userId: string) => {
    const response = await api.get(`/admins/by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
  updateUserJson: async (id: string, data: any) => {

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    const response = await api.patch(`/admins/by-user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  updateDriverFormData: async (driverId: string, driverData: FormData ): Promise<Driver> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.patch<Driver>(`/drivers/${driverId}`, driverData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do motorista:', error);
      throw error;
    }
  },
};

