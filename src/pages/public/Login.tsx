import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Lock, Mail } from 'lucide-react'; // Ícones

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login({ email, password });
            
            // 1. Salva o token
            localStorage.setItem('token', response.access_token);
            
            // 2. Salva o user (opcional, mas útil para mostrar "Olá, Fulano")
            localStorage.setItem('user', JSON.stringify(response.user));

            // 3. Verifica a ROLE e redireciona (ajuste os nomes conforme seu banco de dados)
            const role = response.user.role; // Pode ser maiúsculo ou minúsculo, verifique seu banco!

            switch (role) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'OPERATOR':
                    navigate('/operator/dashboard');
                    break;
                case 'MOTORISTA': // ou 'MOTORISTA', depende de como você salvou no banco
                    navigate('/driver/dashboard');
                    break;
                default:
                    // Se não tiver role definida ou for desconhecida
                    navigate('/login');
                    alert('Usuário sem perfil definido');
            }

        } catch (err: any) {
            console.error(err);
            // Tenta pegar a mensagem de erro do NestJS se ela existir
            const message = err.response?.data?.message || 'Falha ao fazer login. Verifique suas credenciais.';
            setError(Array.isArray(message) ? message[0] : message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Frota</h1>
                    <p className="text-gray-500 mt-2">Entre para continuar</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e: { target: { value: any; }; }) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}