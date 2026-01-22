import React, { useState } from 'react';
import { 
  X,  
  Mail, 
  Briefcase,
  IdCard,
  Pill,
  Plus,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DriverCreateData {
    name: string;
    email: string;
    password: string;
    cnh: string;
    company: string;
    status: string;
    photoUrl: string;
    toxicologyExam: Date | null;
}

interface DriverCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DriverCreateData) => Promise<void>;
  isLoading?: boolean;
}

const DriverCreateModal: React.FC<DriverCreateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false 
}) => {
  
  // Estado inicial limpo
  const initialFormState = {
    name: '',
    email: '',
    password: '', // Novo campo obrigatório na criação
    cnh: '',
    company: '',
    status: 'PENDENTE',
    photoUrl: '',
    toxicologyExam: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reseta o formulário ao fechar se necessário, ou mantenha os dados se preferir
  const handleClose = () => {
    // setFormData(initialFormState); // Descomente se quiser limpar ao fechar
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Estrutura o payload para criar User + Driver numa transação
    const payload: DriverCreateData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      cnh: formData.cnh,
      company: formData.company,
      status: formData.status,
      photoUrl: formData.photoUrl,
      toxicologyExam: formData.toxicologyExam ? new Date(formData.toxicologyExam) : null,
    };

    await onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col"
      >
        
        {/* Header com Gradiente (Verde ou Azul para diferenciar, mantive Azul) */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0">
          <div className="absolute top-4 left-6">
             <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Plus size={20} className="bg-white/20 p-0.5 rounded-full" />
                Novo Motorista
             </h2>
             <p className="text-blue-100 text-xs mt-1">Preencha os dados para criar o acesso e o perfil.</p>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={30} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6 flex-1">
          
          {/* Foto e Input de Nome (Sobreposto ao Header) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-10 mb-8 gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md relative overflow-hidden flex items-center justify-center">
                {formData.photoUrl ? (
                  <img 
                    src={formData.photoUrl} 
                    alt="Preview" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <Camera size={24} />
                    <span className="text-[10px] mt-1">Foto URL</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 w-full sm:w-auto z-20">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-xl font-bold text-gray-900 bg-white border-b-2 border-gray-200 focus:border-blue-500 px-2 py-1 outline-none transition-colors placeholder:font-normal placeholder:text-gray-300"
                placeholder="Ex: João da Silva"
                required
              />
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Seção 1: Credenciais de Acesso */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Lock size={16} /> Acesso do Usuário
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email (Login) *</label>
                <div className="flex items-center gap-2">
                    <Mail className="text-gray-400" size={20} />
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="motorista@empresa.com"
                    required
                    />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Senha Inicial *</label>
                <div className="flex items-center gap-2">
                    <Lock className="text-gray-400" size={20} />
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    />
                </div>
                <p className="text-[10px] text-gray-400 pl-7">Mínimo de 6 caracteres.</p>
              </div>

               <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Status Inicial</label>
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
            </div>

            {/* Seção 2: Dados do Motorista */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <IdCard size={16} /> Dados Profissionais
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">CNH *</label>
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
              </div>

            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 border-t mt-auto shrink-0 rounded-b-xl">
          <button 
            type="button"
            onClick={handleClose}
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
              <>Criando...</>
            ) : (
              <>
                <Plus size={18} />
                Criar Motorista
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DriverCreateModal;