import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Briefcase,
  Save,
  User,
  Building,
  MapPin,
  FileText
} from 'lucide-react';
import type { Operator } from '../../types'; // Certifique-se de ter esse type

interface OperatorUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
  operator: Operator | null;
  isLoading?: boolean;
}

const OperatorUpdateModal: React.FC<OperatorUpdateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  operator,
  isLoading = false
}) => {

  // Estado local para o formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'CLT' as 'CLT' | 'PJ',
    company: '',
    region: '',
    cpf: '',
    cnpj: '',
  });

  // Popula o formulário quando o modal abre ou o operator muda
  useEffect(() => {
    if (isOpen && operator) {
      setFormData({
        name: operator.user?.name || '',
        email: operator.user?.email || '',
        type: (operator.type as 'CLT' | 'PJ') || 'CLT',
        company: operator.company || '',
        region: operator.region || '',
        cpf: operator.cpf || '',
        cnpj: operator.cnpj || '',
      });
    }
  }, [isOpen, operator]);

  if (!isOpen || !operator) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara o payload limpando o documento que não pertence ao tipo selecionado
    const payload = {
      name: formData.name,
      email: formData.email,
      type: formData.type,
      company: formData.company,
      region: formData.region,
      cpf: formData.type === 'CLT' ? formData.cpf : undefined,
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
        
        {/* Header com Gradiente Teal */}
        <div className="relative h-24 bg-gradient-to-r from-teal-600 to-emerald-800 shrink-0">
          <div className="absolute top-4 left-6 my-2 text-white/90 font-medium">
            Editando Operador
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6 pt-0">
          
          {/* Avatar (Estático) e Input de Nome */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-10 mb-8 gap-4">
            
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md flex items-center justify-center text-gray-400">
                    <User size={48} />
                </div>
             </div>
            
            <div className="flex-1 w-full sm:w-auto z-20">
              <label className="block text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-xl font-bold text-gray-900 bg-white border-b-2 border-gray-200 focus:border-teal-500 py-1 outline-none transition-colors placeholder:font-normal"
                placeholder="Nome do operador"
                required
              />
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Seção 1: Dados Contratuais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Briefcase size={16} /> Dados Contratuais
              </h3>

              {/* Tipo */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Tipo de Contrato</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                  </select>
                </div>
              </div>

              {/* Documento Condicional */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    {formData.type === 'CLT' ? 'CPF' : 'CNPJ'}
                </label>
                <div className="flex items-center gap-2">
                    <FileText className="text-gray-400" size={20} />
                    {formData.type === 'CLT' ? (
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="000.000.000-00"
                        />
                    ) : (
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="00.000.000/0001-00"
                        />
                    )}
                </div>
              </div>

              {/* Empresa */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Empresa</label>
                <div className="flex items-center gap-2">
                    <Building className="text-gray-400" size={20} />
                    <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Nome da empresa"
                    />
                </div>
              </div>
            </div>

            {/* Seção 2: Localização e Contato */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <MapPin size={16} /> Localização & Contato
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email (Login)</label>
                <div className="flex items-center gap-2">
                    <Mail className="text-gray-400" size={20} />
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                    />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Região</label>
                <div className="flex items-center gap-2">
                    <MapPin className="text-gray-400" size={20} />
                    <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Ex: Sul, Matriz..."
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t mt-auto shrink-0">
          <span className="text-xs text-gray-400 font-mono">
             ID: {operator.id.slice(0, 8)}...
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
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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

export default OperatorUpdateModal;