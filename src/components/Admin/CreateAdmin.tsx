import React, { useState } from 'react';
import { X, Plus, Loader2, ShieldCheck, Mail, Lock, MapPin, User } from 'lucide-react';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
        
        {/* Header Roxo */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="bg-white/20 p-0.5 rounded-full" /> Novo Administrador
            </h2>
            <p className="text-violet-100 text-xs mt-1">Crie um novo usuário com acesso total ao sistema.</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="Ex: João Silva" />
            </div>
          </div>

          {/* Email e Senha */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Email de Acesso *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="admin@sistema.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Senha Inicial *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="••••••••" minLength={6} />
            </div>
          </div>

          {/* Região (Específico de Admin no seu schema) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Região de Controle (Opcional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input name="region" value={formData.region} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="Ex: Matriz - SP" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Criar Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminModal;