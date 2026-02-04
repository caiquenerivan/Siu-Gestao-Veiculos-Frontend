import React from 'react';
import { X, ShieldCheck, MapPin, Mail, UserCheck } from 'lucide-react';

interface AdminInfoModalProps {
  admin: any;
  isOpen: boolean;
  onClose: () => void;
}

const AdminInfoModal: React.FC<AdminInfoModalProps> = ({ admin, isOpen, onClose }) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header Visual Roxo */}
        <div className="h-28 bg-gradient-to-br from-purple-800 to-violet-900 flex items-center justify-center relative">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg absolute -bottom-10 border-4 border-white">
            <ShieldCheck size={40} className="text-purple-700" />
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="pt-12 pb-6 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">{admin.user?.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Super Admin
          </span>
        </div>

        <div className="px-6 pb-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
            
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail size={16} className="text-violet-600" />
              <span className="font-medium">{admin.user?.email}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin size={16} className="text-violet-600" />
              <span>{admin.region || 'Região Global'}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck size={16} className="text-violet-600" />
              <span>Status: <strong className="text-green-600">Ativo</strong></span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoModal;