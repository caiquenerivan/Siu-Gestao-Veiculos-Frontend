import type { CreateOperatorData, Operator, PaginatedResponse, UpdateOperatorData } from "../types";
import { api } from "./api";


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
  findById: async (id: string): Promise<Operator> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Operator>(`/operators/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar operador por ID:', error);
      throw error;
    }
  },
  findByCompanyId: async (companyId: string, page = 1, limit = 100) =>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('Usuário não autenticado');
      }
      const response = await api.get<PaginatedResponse<Operator>>(`/operators/by-company`, {
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
  findByUserId: async (userId: string): Promise<Operator> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get<Operator>(`/operators/by-user/${userId}`, {
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
