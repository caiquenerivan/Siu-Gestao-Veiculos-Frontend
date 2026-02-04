import React, { useState } from 'react';
import { X, Plus, Loader2, Building2, Mail, Lock, MapPin, Phone, FileText } from 'lucide-react';

interface CompanyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cnpj: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
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
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex justify-between items-center rounded-t-xl shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Plus size={20} className="bg-white/20 p-0.5 rounded-full" /> Nova Empresa Parceira
            </h2>
            <p className="text-teal-100 text-xs mt-1">Cadastre os dados de acesso e localização.</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Dados Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Razão Social / Nome *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: Transportadora Express Ltda" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">CNPJ *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-mono" placeholder="00.000.000/0001-00" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="(11) 99999-9999" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Dados de Acesso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Email de Acesso *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="admin@empresa.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Senha Inicial *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••••" minLength={6} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Endereço */}
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin size={16} /> Endereço
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Logradouro</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="Rua das Flores, 123" />
             </div>
             
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
                <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="São Paulo" />
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                <input name="state" value={formData.state} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="SP" maxLength={2} />
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">CEP</label>
                <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="00000-000" />
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-xl border-t shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreateModal;