import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { api } from '../services/api'; 
import { authService } from '../services/authService'; // Importa o seu serviço

// Tipagem do Usuário (baseada na sua LoginResponse)
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

// Tipagem dos dados do Contexto
interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // Tenta recuperar os dados salvos no navegador
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        // 1. Restaura o usuário no estado
        setUser(JSON.parse(storedUser));
        
        // 2. Re-injeta o token no Axios para que as chamadas funcionem
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
        setLoading(true);
      // 1. Chama o SEU serviço que já existe
      const response = await authService.login({ email, password });

      // O response.data já vem limpo do seu service, contendo { access_token, user }
      const { access_token, user: userData } = response;

      // 2. Salva no LocalStorage (para persistir após F5)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', access_token);

      // 3. Define o token como padrão para TODAS as próximas requisições do Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // 4. Atualiza o estado global
      setUser(userData);

      return userData;

    } catch (error) {
      console.error("Erro no Context ao logar:", error);
      throw error; // Lança o erro para a tela de Login exibir o alerta
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove o token do Axios
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      signed: !!user, // Transforma o objeto user em booleano (true se existe, false se null)
      user,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para facilitar a importação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}