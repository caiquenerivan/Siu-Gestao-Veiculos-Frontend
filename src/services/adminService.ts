import type { AdminsResponse, PaginatedResponse } from "../types";
import { api } from "./api";

// Adapte as interfaces conforme seu arquivo types.ts
export interface Admin {
  id: string;
  region?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    cpf?: string;
    cnpj?: string;
  };
}

export const adminService = {
  findMany: async (page: number, limit: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<PaginatedResponse<AdminsResponse[]>>(`/admins?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      return response;
    } catch (error) {
        console.error("Erro ao buscar admins", error);
    }
  },
  create: async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuário não encontrado');
        }
        const response = await api.post<any>('admins',
            data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data;        
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        throw error;
    }
  },
  findByUserId: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não encontrado');
      }
      const response = await api.patch<Admin>(`/admins/by-uyser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data;
      
    } catch (error) {
      console.error('Erro ao encontrar admin:', error);
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não encontrado');
      }
      const response = await api.patch<Admin>(`/admins/${id}`,
        data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response;
    } catch (error) {
      console.error('Erro ao atualizar admin:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não encontrado');
      }
      const response = api.delete(`/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Erro ao deletar admin:', error);
      throw error;
    }
  },
};