import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Briefcase,
  IdCard,
  Pill,
  Save,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Driver } from '../../types'; // Ajuste o import conforme necessário
import type { UpdateDriverData } from '../../types';

interface DriverUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>; // Função para enviar ao backend
  driver: Driver | null;
  isLoading?: boolean;
}

const DriverUpdateModal: React.FC<DriverUpdateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  driver,
  isLoading = false
}) => {


  // Estado local para o formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cnh: '',
    company: '',
    status: 'PENDENTE',
    photoUrl: '',
    toxicologyExam: '',
  });

  // Popula o formulário quando o modal abre ou o driver muda
  useEffect(() => {
    if (isOpen && driver) {
      setFormData({
        name: driver.user?.name || '',
        email: driver.user?.email || '',
        cnh: driver.cnh || '',
        company: driver.company || '',
        status: driver.status || 'PENDENTE',
        photoUrl: driver.photoUrl || '',
        // Formata a data para YYYY-MM-DD para o input type="date"
        toxicologyExam: driver.toxicologyExam 
          ? new Date(driver.toxicologyExam).toISOString().split('T')[0] 
          : '',
      });
    }
  }, [isOpen, driver]);

  if (!isOpen || !driver) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateDriverData= {
      name: formData.name,
      email: formData.email,
      cnh: formData.cnh,
      company: formData.company,
      status: formData.status,
      photoUrl: formData.photoUrl,
      toxicologyExam: formData.toxicologyExam ? new Date(formData.toxicologyExam) : null,
    };
    // Reconstrói a estrutura esperada pelo backend (separando User e Driver se necessário)
    await onSave(payload);
    onClose();
  
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col"
      >
        
        {/* Header com Gradiente */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-blue-800 shrink-0">
          <div className="absolute top-4 left-6 text-white/90 font-medium">
            Editando Motorista
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={30} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6 flex-1">
          
          {/* Foto e Input de Nome (Sobreposto ao Header) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-8 gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md relative overflow-hidden">
                {formData.photoUrl ? (
                  <img 
                    src={formData.photoUrl} 
                    alt="Preview" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={40} />
                  </div>
                )}
                {/* Overlay para simular upload */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="text-white" size={24} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full sm:w-auto z-20">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-xl font-bold text-gray-900 bg-white border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1 outline-none transition-colors placeholder:font-normal"
                placeholder="Nome do motorista"
                required
              />
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Seção 1: Dados Profissionais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <IdCard size={16} /> Dados Profissionais
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    {formData.status === 'ATIVO' ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} />}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">CNH</label>
                <input
                  type="text"
                  name="cnh"
                  value={formData.cnh}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="00000000000"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Empresa / Frota</label>
                <div className="flex items-center gap-2">
                    <Briefcase className="text-gray-400" size={20} />
                    <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nome da empresa"
                    />
                </div>
              </div>
            </div>

            {/* Seção 2: Contato e Saúde */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Mail size={16} /> Contato & Saúde
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email (Login)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="usuario@email.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Validade Toxicológico</label>
                <div className="flex items-center gap-2">
                    <Pill className="text-gray-400" size={20} />
                    <input
                    type="date"
                    name="toxicologyExam"
                    value={formData.toxicologyExam}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">URL da Foto</label>
                <input
                  type="text"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-600"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-gray-400">Cole o link direto da imagem aqui.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t mt-auto shrink-0 rounded-b-xl">
          <span className="text-xs text-gray-400">
             ID: {driver.id.slice(0, 8)}...
          </span>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save size={18} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default DriverUpdateModal;