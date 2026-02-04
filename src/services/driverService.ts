import type { CreateDriverData, Driver, PaginatedResponse, UpdateDriverData } from "../types";
import { api } from "./api";

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
        }
      });
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      throw error;
    }
  },
  findByCompanyId_: async (companyId: string, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<PaginatedResponse<Driver>>(`/drivers/by-company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyId: companyId,
          page,
          limit
        }
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar motoristas da empresa:', error);
      throw error;
    }
  },
  findByCompanyId: async (companyId: string, page = 1, limit = 100)=> {
    try {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    const response = await api.get<PaginatedResponse<Driver>>(`/drivers/by-company`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        params: {
        companyId: companyId,
        page,
        limit,
        }
    });
    console.log(response);
    
    return response;
    } catch (error) {
    console.error('Erro ao buscar motoristas da empresa:', error);
    throw error;
    }
  },
  findById: async (id: string): Promise<Driver> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Driver>(`/drivers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motorista por ID:', error);
      throw error;
    }
  },
  findByUserId: async (userId: string): Promise<Driver> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Driver>(`/drivers/by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motorista por ID de usuário:', error);
      throw error;
    } 
  },
};