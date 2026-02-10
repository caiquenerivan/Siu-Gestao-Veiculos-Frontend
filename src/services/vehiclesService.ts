import type { CreateVehicleData, PaginatedResponse, UpdateVehicleData, Vehicle } from "../types";
import { api } from "./api";


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
  findByCompanyId: async (companyId: string, page = 1, limit = 10)=> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<PaginatedResponse<Vehicle>>(`/vehicles/by-company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyId: companyId,
          page,
          limit,
        }
      });      
      return response;
    } catch (error) {
      console.error('Erro ao buscar veículos da empresa:', error);
      throw error;
    }
  },
  findByDriverId: async (driverId: string, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<PaginatedResponse<Vehicle>>(`/vehicles/by-driver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          driverId: driverId,
          page,
          limit
        }
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar veículos do motorista:', error);
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

