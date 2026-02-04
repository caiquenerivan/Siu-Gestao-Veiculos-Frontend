import React, { useEffect, useState } from 'react';
import { X, Loader2, Building2, Mail, Lock, MapPin, Phone, FileText, Save, UtilityPole, MapMinus, Compass } from 'lucide-react';

interface EditCompanyModalProps {
  company: any; // Use a interface Company correta aqui
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ company, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Opcional na edição
    cnpj: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (isOpen && company) {
      setFormData({
        name: company.user?.name || '',
        email: company.user?.email || '',
        password: '', // Começa vazia
        cnpj: company.user?.cnpj || '',
        phone: company.phone || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        zipCode: company.zipCode || ''
      });
    }
  }, [isOpen, company]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Se a senha estiver vazia, o backend deve ignorar
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="bg-teal-600 p-6 flex justify-between items-center rounded-t-xl shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Building2 size={20} className="text-teal-200" /> Editar Empresa
          </h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Mesmos campos do Create, mas com valores preenchidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Razão Social *</label>
              <div className='relative'>
                <Building2 className="absolute left-3 top-3 text-gray-400" size={16} />
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
              <div className='relative'>
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
            </div>
             <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
              <div className='relative'>
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Email (Login)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 p-2 bg-gray-50 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nova Senha (Opcional)</label>
              <div className="relative">
                 <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                 <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-9 p-2 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400" placeholder="Deixe em branco para manter" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Endereço</label>
                <div className='relative'>
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
                <div className='relative'>
                    <MapMinus className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                <div className='relative'>
                    <Compass className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input name="state" value={formData.state} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">CEP</label>
                <div className='relative'>
                    <UtilityPole className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg" />
                </div>
             </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-xl border-t shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyModal;