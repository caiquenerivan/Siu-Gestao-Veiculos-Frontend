import { api } from './api';

// Defina os tipos baseados no que seu NestJS espera e retorna
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string; // Ex: 'ADMIN', 'OPERATOR', 'DRIVER'
    companyId?: string;
    driverId?: string;
  }
    // Se seu backend retornar o usuário junto, adicione aqui. Ex: user: { role: string ... }
}

export interface RegisterCompanyData {
  name: string;
  email: string;
  password: string;
  cnpj: string;
  companyId?: string;
  role: 'COMPANY';
}

export interface RegisterDriverData {
  name: string;
  email: string;
  password: string;
  cnh: string;
  role: 'MOTORISTA'; // ou 'DRIVER', verifique seu backend
  companyId?: string;
  driverId?: string;
}



export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
      // Ajuste a URL '/auth/login' se for diferente no seu backend
    const response = await api.post<LoginResponse>('/auth/login', data);
    console.log(response);
    return response.data;
  },
  register: async (data: RegisterCompanyData | RegisterDriverData) => {
    // Ajuste a URL conforme seu backend (ex: '/auth/register' ou '/users')
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};