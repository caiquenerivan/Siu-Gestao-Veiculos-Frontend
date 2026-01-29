import React, { useState, useEffect } from 'react'; // Adicione useEffect
import { 
  X, Mail, Briefcase, IdCard, Pill, Plus, Lock, Camera, CheckCircle, AlertCircle, Upload 
} from 'lucide-react';

// 1. Atualize a Interface para aceitar o arquivo opcional
export interface DriverCreateData {
    name: string;
    email: string;
    password: string;
    cnh: string;
    company: string;
    status: string;
    photoUrl: string;
    toxicologyExam: Date | null;
    file?: File; // <--- NOVO CAMPO
}

interface DriverCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DriverCreateData) => Promise<void>;
  isLoading?: boolean;
}

const DriverCreateModal: React.FC<DriverCreateModalProps> = ({ 
  isOpen, onClose, onSave, isLoading = false 
}) => {
  
  const initialFormState = {
    name: '',
    email: '',
    password: '',
    cnh: '',
    company: '',
    status: 'PENDENTE',
    photoUrl: '', // Isso será preenchido pelo backend depois
    toxicologyExam: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // 2. Novos estados para o Arquivo e Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Limpa o preview quando o modal fecha ou abre
  useEffect(() => {
    if (!isOpen) {
        setPreviewUrl('');
        setSelectedFile(null);
        setFormData(initialFormState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Função para pegar o arquivo do computador
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Cria uma URL temporária para mostrar a foto na hora
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: DriverCreateData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      cnh: formData.cnh,
      company: formData.company,
      status: formData.status,
      photoUrl: '', // Deixa vazio, o backend vai gerar
      toxicologyExam: formData.toxicologyExam ? new Date(formData.toxicologyExam) : null,
      file: selectedFile || undefined // <--- Envia o arquivo junto
    };

    await onSave(payload);
    // Não precisa fechar aqui, geralmente o pai fecha após sucesso
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col"
      >
        
        {/* Header (Igual) */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0">
          <div className="absolute top-4 left-6">
             <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Plus size={20} className="bg-white/20 p-0.5 rounded-full" />
                Novo Motorista
             </h2>
             <p className="text-blue-100 text-xs mt-1">Preencha os dados para criar o acesso e o perfil.</p>
          </div>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
            <X size={30} />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6 flex-1">
          
          {/* 4. MUDANÇA VISUAL: Foto agora é um Label clicável */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-10 mb-8 gap-4">
            <div className="relative group">
              {/* O input fica escondido, clicamos no label */}
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <label 
                htmlFor="photo-upload" 
                className="w-24 h-24 rounded-full bg-white p-1 shadow-md relative overflow-hidden flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <Camera size={24} />
                    <span className="text-[10px] mt-1">Enviar</span>
                  </div>
                )}
                
                {/* Ícone de upload no hover */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Upload className="text-white" size={20} />
                </div>
              </label>
            </div>

            <div className="flex-1 w-full sm:w-auto z-20">
              <label className="block mb-1 text-sm font-sm font-semibold text-gray-500 uppercase mt-14 ml-1">Nome Completo *</label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção 1 (Mantive igual) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Lock size={16} /> Acesso do Usuário
              </h3>
              {/* ... Inputs de Email, Senha, Status (Mantenha igual ao seu código) ... */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email (Login) *</label>
                <div className="flex items-center gap-2">
                    <Mail className="text-gray-400" size={20} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="motorista@empresa.com" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Senha Inicial *</label>
                <div className="flex items-center gap-2">
                    <Lock className="text-gray-400" size={20} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="••••••••" minLength={6} required />
                </div>
              </div>

               <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Status Inicial</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none">
                    <option value="ATIVO">Ativo</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção 2 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <IdCard size={16} /> Dados Profissionais
              </h3>

              {/* ... Inputs de CNH, Empresa, Toxicológico (Mantenha igual) ... */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">CNH *</label>
                <input type="text" name="cnh" value={formData.cnh} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="00000000000" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Empresa / Frota</label>
                <div className="flex items-center gap-2">
                    <Briefcase className="text-gray-400" size={20} />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nome da empresa" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Validade Toxicológico</label>
                <div className="flex items-center gap-2">
                    <Pill className="text-gray-400" size={20} />
                    <input type="date" name="toxicologyExam" value={formData.toxicologyExam} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>

              {/* 5. REMOVIDO O INPUT DE URL DE FOTO TEXTUAL AQUI */}
              {/* Já estamos tratando a foto lá em cima no header */}
              
            </div>
          </div>
        </div>

        {/* Footer (Igual) */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 border-t mt-auto shrink-0 rounded-b-xl">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <>Criando...</> : <><Plus size={18} /> Criar Motorista</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DriverCreateModal;