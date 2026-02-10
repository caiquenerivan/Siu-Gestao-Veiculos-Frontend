import React, { useEffect, useState } from 'react';
import { 
  User, Building2, Truck, ShieldCheck, 
  MapPin, Phone, Mail, FileText, 
  Briefcase, Activity, Calendar, Loader2 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import { companyService } from '../../services/companyService';
import { operatorService } from '../../services/operatorService';
import { driverService } from '../../services/driverService';
import { Link } from 'react-router-dom';
import type { Company } from '../../types';

// Interfaces simplificadas para o perfil
interface ProfileData {
  id: string;
  user: {
    name: string;
    email: string;
    cpf?: string;
    cnpj?: string;
  };
  // Campos específicos de cada role
  name?: string;
  email?: string;
  region?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cnh?: string;
  status?: string;
  toxicologyExam?: string;
  companyId?: string;
  company?: {
    user: {
      name: string;
    }
  };
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null)

  // Define cores e ícones baseados no Role
  const getRoleTheme = () => {
    switch (user?.role) {
      case 'ADMIN': return { color: 'violet', icon: <ShieldCheck size={40} />, label: 'Administrador' };
      case 'COMPANY': return { color: 'teal', icon: <Building2 size={40} />, label: 'Empresa Parceira' };
      case 'OPERADOR': return { color: 'indigo', icon: <Briefcase size={40} />, label: 'Operador Logístico' };
      case 'MOTORISTA': return { color: 'blue', icon: <Truck size={40} />, label: 'Motorista' };
      default: return { color: 'gray', icon: <User size={40} />, label: 'Usuário' };
    }
  };

  const getEditProfileUrl = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin/editarperfil';
      case 'COMPANY':
        return '/company/editarperfil';
      case 'OPERADOR':
        return '/operator/editarperfil';
      case 'MOTORISTA': 
        return '/driver/editarperfil';
      default:
        return '/login';
    }
  };

  const theme = getRoleTheme();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        let response: any = null;
        
        // Busca dados específicos dependendo do ID que o usuário tem no token
        // O endpoint '/auth/me' seria o ideal, mas vamos simular usando os endpoints específicos
        // ou um endpoint genérico que seu backend possa ter.
        
        if (user.role === 'ADMIN') {
          // Exemplo: GET /admins/me ou busca pelo ID
          // Assumindo que a API retorna o objeto completo
          response = await adminService.findByUserId(user.id); // Ajuste a rota conforme seu backend
        } 
        else if (user.role === 'COMPANY') {
            if (user.companyId) {
              response = await companyService.findById(user.companyId); // Ajuste a rota conforme seu backend
            }
        }
        else if (user.role === 'OPERADOR') {
          response = await operatorService.findByUserId(user.id); // Ajuste a rota conforme seu backend
        }
        else if (user.role === 'MOTORISTA') {
          response = await driverService.findByUserId(user.id); // Ajuste a rota conforme seu backend
        }

        const userProfile = response || response?.data || null;
        console.log(userProfile);

        setProfile(userProfile);

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        // Fallback: usa os dados básicos do contexto se a API falhar
        setProfile({
            id: user.id,
            user: { name: user.name, email: user.email },
        } as ProfileData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (profile?.companyId && !company) {
        try {
          const response = await companyService.findById(profile.companyId);
          setCompany(response);
        } catch (error) {
          console.error("Erro ao buscar empresa vinculada", error);
        }
      }
    };

    fetchCompanyData();
  }, [profile, company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!profile) return null;

  // --- Renderização dos Campos Específicos ---

  const renderAdminFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InfoItem className={`text-${theme.color}-600`} label="Região de Atuação" icon={<MapPin />} value={profile.region || 'Global'} />
         <InfoItem label="CPF" icon={<FileText />} value={profile.user.cpf} />
         <InfoItem label="CNPJ (Vinculado)" icon={<Building2 />} value={profile.user.cnpj} />
      </div>
    </>
  );

  const renderCompanyFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem  className={`text-${theme.color}-600`} label="CNPJ" icon={<FileText />} value={profile.user.cnpj || profile.cnpj} />
        <InfoItem label="Telefone" icon={<Phone />} value={profile.phone} />
      </div>
      
      <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col justify-center items-center">
        <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            <MapPin size={16} className={`text-${theme.color}-600`} /> <span className={`text-${theme.color}-600`} >Endereço</span>
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p>{profile.address || 'Endereço não informado'}</p>
            {(profile.city || profile.state) && (
                <p className="mt-1">{profile.city} - {profile.state}</p>
            )}
            {profile.zipCode && <p className="mt-1 text-gray-500">CEP: {profile.zipCode}</p>}
        </div>
      </div>
    </>
  );


  const renderOperatorFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <InfoItem label="Empresa Vinculada" icon={<Building2 />} value={company?.user.name} />
        <InfoItem label="Região" icon={<MapPin />} value={profile.region} />
        <InfoItem label="CPF" icon={<FileText />} value={profile.user.cpf} />
      </div>
    </>
  );

  const renderDriverFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="CNH" icon={<FileText />} value={profile.cnh} />
      <InfoItem label="Status" icon={<Activity />} 
        value={
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${profile.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
             {profile.status || 'N/A'}
          </span>
        } 
        isComponent
      />
      <InfoItem label="Exame Toxicológico" icon={<Calendar />} 
          value={profile.toxicologyExam ? new Date(profile.toxicologyExam).toLocaleDateString() : 'Não informado'} 
      />
      <InfoItem label="Empresa Vinculada" icon={<Building2 />} value={profile.company?.user?.name || 'Autônomo / Sem vínculo'} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center ">
      <div className="w-full max-w-4xl flex flex-col">
        
        {/* Header Visual com Gradiente */}
        <div className={`relative h-48 bg-gradient-to-r from-${theme.color}-600 to-${theme.color}-800 rounded-t-2xl shadow-lg overflow-hidden`}>
            {/* Elementos decorativos de fundo */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-b-2xl shadow-xl -mt-10 mb-10 relative z-10 border border-gray-100">
            
            {/* Avatar e Informações Básicas */}
            <div className="flex flex-col md:flex-row items-start md:items-end px-8 pb-8 pt-0 gap-6">
                
                {/* Avatar */}
                <div className="relative -mt-16">
                    <div className="w-32 h-32 bg-white p-1.5 rounded-full shadow-lg">
                        <div className={`w-full h-full bg-${theme.color}-50 rounded-full flex items-center justify-center text-${theme.color}-600`}>
                            {theme.icon}
                        </div>
                    </div>
                </div>

                {/* Nome e Role */}
                <div className="flex-1 mb-2 pt-4 md:pt-0">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name || profile.user.email}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                        <span className={`inline-flex items-center  px-2.5 py-0.5 rounded-full text-xs font-medium bg-${theme.color}-100 text-${theme.color}-800 uppercase tracking-wide`}>
                            {theme.label}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Mail size={14} /> { profile.email || profile.user.email}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Conteúdo Específico */}
            <div className="p-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informações Detalhadas</h2>
                
                {user?.role === 'ADMIN' && renderAdminFields()}
                {user?.role === 'COMPANY' && renderCompanyFields()}
                {user?.role === 'OPERADOR' && renderOperatorFields()}
                {user?.role === 'MOTORISTA' && renderDriverFields()}
            </div>

            {/* Footer / Botão de Editar (Opcional) */}
            <div className="bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-100 text-right">
                <span className="text-lg text-gray-400 italic flex w-full items-center justify-end">
                    <Link to={getEditProfileUrl()} className={`bg-${theme.color}-600 hover:bg-${theme.color}-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2`} > 
                        Editar 
                    </Link>
                </span>
            </div>

        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para exibir itens
const InfoItem = ({ label, icon, value, isComponent = false }: any) => {
  // Clona o ícone para adicionar classes de tamanho e cor
  const styledIcon = React.cloneElement(icon, { size: 18, className: "text-gray-400" });

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {styledIcon} {label}
      </span>
      <div className={`text-sm font-medium text-gray-900 pl-6 border-l-2 border-gray-100 ${!value ? 'italic text-gray-400' : ''}`}>
        {isComponent ? value : (value || 'Não informado')}
      </div>
    </div>
  );
};