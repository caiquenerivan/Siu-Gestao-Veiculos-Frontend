import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Briefcase,
  Van,
  IdCard,
  Car,
  Pill
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// 2. O que vem dentro de 'vehicle'
interface VehicleData {
  id: string;
  model: string;
  plate: string;
  brand: string;
  color: string;
  status: 'REGULAR' | 'FURTO' | 'IRREGULAR';
  licensingDate: string;
  ownerName: string;  
}

interface Driver {
  id: string;
  cnh: string;
  status: 'PENDENTE' | 'ATIVO' | 'BLOQUEADO'; // Union type para o Enum
  photoUrl?: string; // Opcional
  publicToken: string;
  createdAt: string; // Vem como string ISO do JSON
  user: UserData;    // Relação obrigatória
  vehicle?: VehicleData | null; // Relação opcional (pode ser null)
  company: string;
  toxicologyExam: string;
}

interface DriverInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver; // Você pode substituir 'any' pela sua interface Driver real
}

const DriverInfoModal: React.FC<DriverInfoModalProps> = ({ isOpen, onClose, driver }) => {
    if (!isOpen || !driver) return null;

  // Função auxiliar para formatar datas
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Define a cor do status
  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-5xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header com Gradiente */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-blue-800 ">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={30} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6">
          
          {/* Foto e Informações Básicas (Sobreposto ao Header) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-6 gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                {driver.photoUrl ? (
                  <img 
                    src={driver.photoUrl} 
                    alt={driver.user.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={40} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 z-20">

                <span className="text-2xl font-bold text-gray-900 bg-white p-1 rounded-3xl px-6">
                    {driver.user.name}
                </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(driver.status)}`}>
                  {driver.status || 'Indefinido'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Seção 1: Documentação (Crítico para Frotas) */}
            <div className="space-y-4 flex flex-col ">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
                Documentação
              </h3>
              
              <div className="flex gap-3 items-center">
                <IdCard className="text-gray-400 mt-1" size={30} />
                <div className="flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">CNH</p>
                  <p className="font-medium text-gray-900">{driver.cnh || '---'}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Car className="text-gray-400 mt-1" size={30} />
                <div className="flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Veículo</p>
                  <p className="font-medium text-gray-900">{driver.vehicle?.brand  || '---'} - {driver.vehicle?.model  || '---'}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Van className="text-gray-400 mt-1" size={30} />
                <div className="flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="font-medium text-gray-900">{driver.vehicle?.plate || '---'}</p>
                </div>
              </div>
            </div>

            {/* Seção 2: Contato e Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
                Contato & Dados
              </h3>

              <div className="flex items-center gap-3">
                <Mail className="text-gray-400 mt-1" size={30} />
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 truncate" title={driver.user.email}>
                    {driver.user.email || '---'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-gray-400 mt-1" size={30} />
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium text-gray-900">{driver.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400 mt-1" size={30} />
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Data de Criação do Perfil</p>
                  <p className="font-medium text-gray-900">{formatDate(driver.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Pill className="text-gray-400 mt-1" size={30} />
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-sm text-gray-500">Validade Exame toxicológico</p>
                  <p className="font-medium text-gray-900">{formatDate(driver.toxicologyExam)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer com Ações */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default DriverInfoModal;