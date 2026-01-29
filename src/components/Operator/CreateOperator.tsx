import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Briefcase, Plus, Lock, Building, MapPin, FileText, User
} from 'lucide-react';
import type { CreateOperatorData } from '../../types'; // Certifique-se de importar o tipo correto

interface OperatorCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateOperatorData) => Promise<void>;
  isLoading?: boolean;
}

const OperatorCreateModal: React.FC<OperatorCreateModalProps> = ({ 
  isOpen, onClose, onSave, isLoading = false 
}) => {
  
  const initialFormState = {
    name: '',
    email: '',
    password: '',
    type: 'PF' as 'PF' | 'PJ',
    company: '',
    region: '',
    cpf: '',
    cnpj: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reseta o form ao fechar
  useEffect(() => {
    if (!isOpen) {
        setFormData(initialFormState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Monta o payload, enviando apenas o documento pertinente ao tipo
    const payload: CreateOperatorData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      type: formData.type,
      company: formData.company,
      region: formData.region,
      // Se for PF manda CPF, se PJ manda CNPJ
      cpf: formData.type === 'PF' ? formData.cpf : undefined,
      cnpj: formData.type === 'PJ' ? formData.cnpj : undefined,
    };

    await onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden"
      >
        
        {/* Header (Tema Teal para Operador) */}
        <div className="relative h-20 bg-gradient-to-r from-teal-600 to-emerald-700 shrink-0 flex items-center px-6">
          <div>
             <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Plus size={20} className="bg-white/20 p-0.5 rounded-full" />
                Novo Operador
             </h2>
             <p className="text-teal-100 text-xs mt-1">Preencha os dados para criar o acesso operacional.</p>
          </div>
          <button type="button" onClick={onClose} className="absolute top-5 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6">
          
          {/* Nome Completo (Destaque) */}
          <div className="mb-6">
            <label className="block mb-1 text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo *</label>
            <div className="relative">
                <User className="absolute left-0 top-2 text-gray-400" size={24} />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-8 text-xl font-bold text-gray-900 bg-white border-b-2 border-gray-200 focus:border-teal-500 py-1 outline-none transition-colors placeholder:font-normal placeholder:text-gray-300"
                    placeholder="Ex: Maria Souza"
                    required
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ========================================= */}
            {/* COLUNA 1: ACESSO */}
            {/* ========================================= */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Lock size={16} /> Credenciais
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email (Login) *</label>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                    <Mail className="text-gray-400 shrink-0" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent outline-none text-sm" placeholder="operador@empresa.com" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Senha Inicial *</label>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                    <Lock className="text-gray-400 shrink-0" size={18} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-transparent outline-none text-sm" placeholder="••••••••" minLength={6} required />
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* COLUNA 2: DADOS PROFISSIONAIS */}
            {/* ========================================= */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Briefcase size={16} /> Dados Contratuais
              </h3>

              {/* TIPO + EMPRESA */}
              <div className="flex gap-3">
                <div className="w-1/3 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Tipo *</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-teal-500">
                        <option value="PF">PF</option>
                        <option value="PJ">PJ</option>
                    </select>
                </div>
                <div className="w-2/3 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Empresa *</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        <Building className="text-gray-400 shrink-0" size={16} />
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-transparent outline-none text-sm" placeholder="Nome da empresa" required/>
                    </div>
                </div>
              </div>

              {/* REGIÃO */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Região de Atuação</label>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500">
                    <MapPin className="text-gray-400 shrink-0" size={18} />
                    <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-transparent outline-none text-sm" placeholder="Ex: Sul, SP Capital..." />
                </div>
              </div>

              {/* CPF ou CNPJ (Condicional) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    {formData.type === 'PF' ? 'CPF do Funcionário' : 'CNPJ da Empresa'}
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500">
                    <FileText className="text-gray-400 shrink-0" size={18} />
                    {formData.type === 'PF' ? (
                        <input 
                            type="text" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleChange} 
                            className="w-full bg-transparent outline-none text-sm" 
                            placeholder="000.000.000-00" 
                        />
                    ) : (
                        <input 
                            type="text" 
                            name="cnpj" 
                            value={formData.cnpj} 
                            onChange={handleChange} 
                            className="w-full bg-transparent outline-none text-sm" 
                            placeholder="00.000.000/0001-00" 
                        />
                    )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 border-t mt-auto shrink-0">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <>Salvando...</> : <><Plus size={18} /> Criar Operador</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default OperatorCreateModal;