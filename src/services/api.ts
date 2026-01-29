import axios from 'axios';
import type { CreateDriverData, CreateOperatorData, CreateVehicleData, Driver, Operator, UpdateDriverData, UpdateOperatorData, UpdateVehicleData, Vehicle } from '../types';

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
            'Content-Type': 'multipart/form-data',
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
      const response = await api.patch<Driver>(`/drivers/${id}`, driverData, {
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

export const operatorService = {
  create: async(operatorData: CreateOperatorData): Promise<Operator> => {
    try {
      const token = localStorage.getItem('token');
      // --- FIM DEBUG ---

      if (!token) {
        throw new Error('Usuário não autenticado (Token vazio)');
      }
      const response = await api.post<Operator>('/operators',
        operatorData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
      return response.data;    
    } catch (error) {
      console.error('Erro ao criar operador:', error);
      throw error;
    }
  }, 
  findMany: async (): Promise<Operator[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Operator[]>('/operators', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar operadores:', error);
      throw error;
    }
  },
  update: async (id: string, operatorData: UpdateOperatorData): Promise<Operator> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.patch<Operator>(`/operators/${id}`, operatorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar operador:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      await api.delete(`/operators/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao deletar operador:', error);
      throw error;
    }
  },
};




export const vehicleService = {
  // Implementar métodos relacionados a veículos aqui
  create: async (vehicleData: CreateVehicleData): Promise<Vehicle> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.post('/vehicles', vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },
  findMany: async (): Promise<Vehicle[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Vehicle[]>('/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  },
  update: async (id: string, vehicleData: UpdateVehicleData): Promise<Vehicle> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.patch<Vehicle>(`/vehicles/${id}`, vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      await api.delete(`/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  },
};

