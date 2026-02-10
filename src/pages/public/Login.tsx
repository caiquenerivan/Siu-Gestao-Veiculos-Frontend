import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, Car } from 'lucide-react'; // Ícones
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';


export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setisSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { signIn, user } = useAuth(); // Pegue o user também para debug se precisar
    const { signed } = useAuth();
    
    useEffect(() => {
        if (signed && user && user.role) {
            const role = user?.role?.toUpperCase(); 
            
            switch (role) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'OPERADOR':
                    navigate('/operator/dashboard');
                    break;
                case 'COMPANY':
                    navigate('/company/dashboard');
                    break;
                case 'MOTORISTA': // ou 'MOTORISTA', depende de como você salvou no banco
                    navigate('/driver/dashboard');
                    break;
                default:
                    // Se não tiver role definida ou for desconhecida
                    navigate('/login');
                    console.warn("Role desconhecida:", role);
                    alert('Usuário sem perfil definido');
                    localStorage.clear();
            }
        }
    }, [signed, user, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setisSubmitting(true);
        setError('');

        try {
            // 1. Chama APENAS o signIn do contexto (que já chama a API e salva no storage)
            // Agora ele retorna o usuário logado!
            const loggedUser = await signIn(email, password);

            // 2. Verifica a ROLE e redireciona baseado no usuário retornado
            const role = loggedUser.role?.toUpperCase();
            
            await signIn(email, password);
                
            switch (role) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'OPERADOR':
                    navigate('/operator/dashboard');
                    break;
                case 'MOTORISTA': // ou 'MOTORISTA', depende de como você salvou no banco
                    navigate('/driver/dashboard');
                    break;
                case 'COMPANY':
                    navigate('/company/dashboard');
                    break;
                default:
                    // Se não tiver role definida ou for desconhecida
                    navigate('/login');
                    console.warn("Role desconhecida:", role);
                    alert('Usuário sem perfil definido');
                    localStorage.clear();
            }

        } catch (err: any) {
            console.error(err);
            // Tenta pegar a mensagem de erro do NestJS se ela existir
            const message = err.response?.data?.message || err.message|| 'Falha ao fazer login. Verifique suas credenciais.';
            setError(Array.isArray(message) ? message[0] : message);
        } finally {
            setisSubmitting(false);
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
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500 mb-4">
                            Ainda não possui uma conta?
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Botão para Cadastro de Empresa */}
                            <Link
                            to="/signup/company"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors text-sm font-medium group"
                            >
                            <Building2 size={18} className="text-indigo-500 group-hover:text-indigo-700" />
                            Sou Empresa
                            </Link>

                            {/* Botão para Cadastro de Motorista */}
                            <Link
                            to="/signup/driver"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors text-sm font-medium group"
                            >
                            <Car size={18} className="text-emerald-500 group-hover:text-emerald-700" />
                            Sou Motorista
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}