import React, { useEffect, useState } from 'react';
import { X, Loader2, ShieldCheck, Mail, Lock, MapPin, Save, User } from 'lucide-react';

interface EditAdminModalProps {
  admin: any; 
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({ admin, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: '',
  });

  useEffect(() => {
    if (isOpen && admin) {
      setFormData({
        name: admin.user?.name || '',
        email: admin.user?.email || '',
        password: '', // Senha vazia para não alterar
        region: admin.region || '',
      });
    }
  }, [isOpen, admin]);

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
        
        <div className="bg-violet-600 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <ShieldCheck size={20} className="text-violet-200" /> Editar Administrador
          </h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Nova Senha (Opcional)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="Deixe em branco para manter" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Região</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input name="region" value={formData.region} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminModal;