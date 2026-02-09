import { api } from "./api";
import type { Company, PaginatedResponse, UpdateCompanyData } from "../types";

export const companyService = {
  getByUserId: async (userId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get(`/companies/by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar empresa por ID de usuário:', error);
      throw error;
    } 
  },
  create: async(companyData: any): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      // --- FIM DEBUG ---

      if (!token) {
        throw new Error('Usuário não autenticado (Token vazio)');
      }
      const response = await api.post<any>('/companies',
        companyData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
      return response.data;    
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  },
  findMany: async(page: number, limit: number)=> {
    try{
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não encontrado');
      }
      const response = await api.get<PaginatedResponse<Company[]>>(`/companies?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      return response;

    } catch (err) {
      console.error('Erro ao buscar empresas' , err);
      throw err;
    }
  },
  findById: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não encontrado');
      }
      const response = await api.get<Company>(`/companies/${id}`,
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
  update: async (id: string, companyData: UpdateCompanyData): Promise<Company> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.patch<Company>(`/companies/${id}`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar empresa: ', error);
      throw error;
    }
  },
  delete: async(id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
        throw new Error ('Usuário não encontreado.');
      }
      await api.delete(`/companies/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    } catch (error) {
      console.log('Erro ao deletar empresa: ', error)
    }
  }
};