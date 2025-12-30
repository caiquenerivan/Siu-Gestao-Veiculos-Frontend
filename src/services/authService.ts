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
    }
    // Se seu backend retornar o usuário junto, adicione aqui. Ex: user: { role: string ... }
}

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        // Ajuste a URL '/auth/login' se for diferente no seu backend
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },
};