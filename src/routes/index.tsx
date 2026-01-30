import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/public/Login';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import PublicDriverInfo from '../pages/public/DriverInfo';
import { DriverList } from '../pages/driver/DriverList';
import { ProfilePage } from '../components/EditProfile/EditProfile';
import { OperatorList } from '../pages/operator/OperatorsList';
import { DriverDashboard } from '../pages/driver/Dashboard';
import { OperatorDashboard } from '../pages/operator/Dashboard';
import { VehicleList } from '../pages/vehicles/VehiclesList';
import { ProtectedRoute } from './ProtectedRoute';

// Componentes temporários só para teste

const CompanyDashboard = () => <div>Company Dashboard (em construção)</div>;

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/p/:token" element={<PublicDriverInfo />} />

      {/* ROTA ADMIN (Já existia) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="motoristas" element={<DriverList />} />
          <Route path="operadores" element={<OperatorList />} />
          <Route path="veiculos" element={<VehicleList />} />
          <Route path="editarperfil" element={<ProfilePage />} />
          {/* ... outras rotas admin ... */}
        </Route>
      </Route>

      {/* NOVA: ROTA OPERADOR */}
      <Route element={<ProtectedRoute allowedRoles={['OPERADOR']} />}>        
        <Route path="/operator" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/operator/dashboard" replace />} />
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="motoristas" element={<DriverList />} />
          <Route path="veiculos" element={<VehicleList />} />
          <Route path="editarperfil" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* NOVA: ROTA MOTORISTA */}
      <Route element={<ProtectedRoute allowedRoles={['MOTORISTA']} />}>
        <Route path="/driver" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/driver/dashboard" replace />} />
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="veiculos" element={<VehicleList />} />
          <Route path="editarperfil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
        <Route path="/company" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/company/dashboard" replace />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="veiculos" element={<VehicleList />} />
          <Route path="editarperfil" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
      {/* Redirecionar raiz para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}