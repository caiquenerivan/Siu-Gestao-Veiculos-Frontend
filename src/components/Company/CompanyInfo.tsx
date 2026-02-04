import React from 'react';
import { X, Building2, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface CompanyInfoModalProps {
  company: any;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header Visual */}
        <div className="h-32 bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center relative">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg absolute -bottom-10">
            <Building2 size={32} className="text-slate-700" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="pt-12 pb-8 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">{company.user?.name}</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
            <FileText size={14} className='text-teal-600'/> {company.user?.cnpj || 'CNPJ não informado'}
          </p>
        </div>

        <div className="px-6 pb-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="text-base font-bold text-gray-500 uppercase">Contato</h3>
            <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
              <Mail size={16} className="text-teal-600" />
              <span>{company.user?.email}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
              <Phone size={16} className="text-teal-600" />
              <span>{company.phone || 'Sem telefone'}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
             <h3 className="text-xs font-bold text-gray-500 uppercase">Localização</h3>
             <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
                <MapPin size={16} className="text-teal-600 mt-0.5" />
                <div>
                   <p>{company.address || 'Endereço não cadastrado'} - {company.zipCode}</p>
                   {company.city && <p className="text-gray-500 text-base mt-0.5">{company.city} - {company.state}</p>}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoModal;