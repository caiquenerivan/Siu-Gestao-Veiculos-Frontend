import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, Users, Truck, FileText } from 'lucide-react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Recupera dados do usuário salvo no login
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Usuário', role: 'GUEST' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Itens do menu (podemos filtrar por role depois)
  const menus = {
    ADMIN: [
      { label: 'Visão Geral', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
      { label: 'Operadores', icon: <Users size={20} />, path: '/admin/operadores' },
      { label: 'Motoristas', icon: <FileText size={20} />, path: '/admin/motoristas' },
      { label: 'Veículos', icon: <Truck size={20} />, path: '/admin/veiculos' },
    ],
    OPERATOR: [
      { label: 'Painel', icon: <LayoutDashboard size={20} />, path: '/operator/dashboard' },
      { label: 'Saídas/Entradas', icon: <Truck size={20} />, path: '/operator/movimentacoes' },
      { label: 'Checklists', icon: <FileText size={20} />, path: '/operator/checklists' },
    ],
    DRIVER: [
      { label: 'Meu Painel', icon: <LayoutDashboard size={20} />, path: '/driver/dashboard' },
      { label: 'Minhas Viagens', icon: <Truck size={20} />, path: '/driver/viagens' },
    ]
  };

  // Seleciona o menu baseado na role (se não achar, usa array vazio)
  // O TypeScript pode reclamar aqui se 'role' for string genérica, 
  // mas para JavaScript/Draft funciona bem.
  const currentMenuItems = menus[user.role as keyof typeof menus] || [];

  // ---------------------------

  return (
    <div className="flex h-screen bg-gray-100 m-auto">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>FrotaGest</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>



        <nav className="flex-1 p-4 space-y-2">
          {/* AQUI MUDOU: usamos currentMenuItems ao invés de menuItems fixo */}
          {currentMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {item.icon}
              <span className={`${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Painel Administrativo</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* O Outlet renderiza o conteúdo da página atual aqui dentro */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}