import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/public/Login';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import PublicDriverInfo from '../pages/public/DriverInfo';
import { DriverList } from '../components/DriverList';

// Componentes temporários só para teste
const OperatorDashboard = () => <h1 className="p-8 text-2xl">Área do Operador 🚛</h1>;
const DriverDashboard = () => <h1 className="p-8 text-2xl">Área do Motorista 🚗</h1>;
const OperadoresList = () => <h1>Lista de Operadores (Em breve)</h1>;
const VeiculosList = () => <h1>Lista de Veículos (Em breve)</h1>;
const EditProfile = () => <h1>Editar Perfil (Em breve)</h1>;

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/p/:token" element={<PublicDriverInfo />} />

        {/* ROTA ADMIN (Já existia) */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="motoristas" element={<DriverList />} />
          <Route path="operadores" element={<OperadoresList />} />
          <Route path="veiculos" element={<VeiculosList />} />
          <Route path="editarperfil" element={<EditProfile />} />
          {/* ... outras rotas admin ... */}
        </Route>

        {/* NOVA: ROTA OPERADOR */}
        <Route path="/operator" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/operator/dashboard" replace />} />
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="motoristas" element={<DriverList />} />
          <Route path="veiculos" element={<VeiculosList />} />
          {/* Exemplo de placeholder para evitar erro 404 ao clicar no menu */}
          <Route path="movimentacoes" element={<h1>Movimentações</h1>} />
          <Route path="checklists" element={<h1>Checklists</h1>} />
        </Route>

        {/* NOVA: ROTA MOTORISTA */}
        <Route path="/driver" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/driver/dashboard" replace />} />
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="viagens" element={<h1>Histórico de Viagens</h1>} />
        </Route>


        {/* Redirecionar raiz para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}