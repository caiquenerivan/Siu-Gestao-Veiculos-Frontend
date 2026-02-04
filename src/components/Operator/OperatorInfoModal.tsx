import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Briefcase,
  MapPin,
  Building,
} from 'lucide-react';
import type { Operator } from '../../types'; // Certifique-se de importar o tipo Operator

interface OperatorInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: Operator;
}

const OperatorInfoModal: React.FC<OperatorInfoModalProps> = ({ isOpen, onClose, operator }) => {
    if (!isOpen || !operator) return null;
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header com Gradiente Teal (Diferente de Motorista) */}
        <div className="relative h-24 bg-gradient-to-r from-teal-600 to-emerald-800">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6">
          
          {/* Avatar e Informações Básicas */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-8 gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
                {/* Operadores geralmente não tem foto obrigatória, usamos ícone padrão */}
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={40} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 z-20 mb-1">
                <span className="text-2xl font-bold text-gray-900 bg-white/80 backdrop-blur-sm p-1 rounded-lg px-2">
                    {operator.user.name}
                </span>
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Seção 1: Dados Contratuais */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Building size={16} /> Dados Contratuais
              </h3>
              

              {/* Empresa */}
              <div className="flex gap-3 items-center group">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                    <Briefcase className="text-gray-400 group-hover:text-teal-600" size={24} />
                </div>
                <div className="flex flex-col justify-center w-full">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Empresa</p>
                  <p className="font-medium text-gray-900">{operator.companyId || '---'}</p>
                </div>
              </div>
            </div>

            {/* Seção 2: Localização e Contato */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <MapPin size={16} /> Localização & Contato
              </h3>

              {/* Email */}
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                    <Mail className="text-gray-400 group-hover:text-teal-600" size={24} />
                </div>
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="font-medium text-gray-900 truncate" title={operator.user.email}>
                    {operator.user.email || '---'}
                  </p>
                </div>
              </div>

              {/* Região */}
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                    <MapPin className="text-gray-400 group-hover:text-teal-600" size={24} />
                </div>
                <div className="overflow-hidden flex flex-col justify-center w-full">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Região de Atuação</p>
                  <p className="font-medium text-gray-900">{operator.region || '---'}</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer com Ações */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t mt-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default OperatorInfoModal;