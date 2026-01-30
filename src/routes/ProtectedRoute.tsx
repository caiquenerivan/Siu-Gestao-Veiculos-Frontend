import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho do seu contexto
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Array de roles permitidas (ex: ['ADMIN', 'COMPANY'])
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, signed } = useAuth();

  // 1. Enquanto carrega os dados do usuário, mostre um loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. Se não estiver logado, redireciona para Login
  if (!signed || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se tiver roles definidas e o usuário não tiver a role necessária
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redireciona para um Dashboard padrão ou página de erro
    // Se for ADMIN, vai pro dashboard de admin, senão pro de user comum, etc.
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Se passou por tudo, renderiza a rota filha (Outlet)
  return <Outlet />;
};