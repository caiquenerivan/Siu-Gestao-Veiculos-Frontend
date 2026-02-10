import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Lock, Camera, Save, Briefcase, 
  IdCard, Pill, Loader2, Shield, MapPin, FileText, Building, 
  Phone, Home, Activity 
} from 'lucide-react';
import { profileService } from '../../services/api';
//import { useAuth } from '../../contexts/AuthContext';

// Interfaces para tipagem dos dados recebidos e enviados
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMPANY' | 'OPERADOR' | 'MOTORISTA';
  
  // Dados aninhados vindos da API
  admin?: { region?: string; cpf?: string; cnpj?: string; company?: string };
  company?: { cnpj?: string; phone?: string; address?: string; city?: string; state?: string; zipCode?: string };
  operator?: { region?: string; cpf?: string; company?: { name: string } | string }; // Pode vir objeto ou string
  driver?: { cnh?: string; status?: string; toxicologyExam?: string; photoUrl?: string; company?: { name: string } | string };
}

export const ProfilePage: React.FC = () => {
  //const { user } = useAuth(); // Apenas para saber o role inicial se precisar
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado único para o formulário
  const [formData, setFormData] = useState({
    // Comuns
    name: '',
    email: '',
    password: '',
    
    // Admin / Operator
    region: '',
    cpf: '',
    
    // Admin / Company
    cnpj: '',
    
    // Company
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Operator
    companyName: '', // Apenas visual ou edição de nome
    
    // Driver
    cnh: '',
    status: '',
    toxicologyExam: '',
    photoUrl: '',
    selectedFile: null as File | null,
  });

  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  // 1. Carregar Dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data: UserData = await profileService.getMe();
        
        setUserRole(data.role);
        setUserId(data.id);

        // Objeto base com dados comuns
        const formValues = {
          name: data.name,
          email: data.email,
          password: '', // Senha sempre vazia ao carregar
          region: '', cpf: '', cnpj: '', phone: '', address: '', city: '', state: '', zipCode: '',
          companyName: '', cnh: '', status: '', toxicologyExam: '', photoUrl: '', selectedFile: null
        };

        // Preenchimento condicional
        if (data.role === 'ADMIN' && data.admin) {
          formValues.region = data.admin.region || '';
          formValues.cpf = data.admin.cpf || '';
          formValues.cnpj = data.admin.cnpj || '';
        } 
        else if (data.role === 'COMPANY' && data.company) {
          formValues.cnpj = data.company.cnpj || '';
          formValues.phone = data.company.phone || '';
          formValues.address = data.company.address || '';
          formValues.city = data.company.city || '';
          formValues.state = data.company.state || '';
          formValues.zipCode = data.company.zipCode || '';
        }
        else if (data.role === 'OPERADOR' && data.operator) {
          formValues.region = data.operator.region || '';
          formValues.cpf = data.operator.cpf || '';
          // Tratamento para company name que pode vir como objeto ou string
          const compName = typeof data.operator.company === 'object' ? data.operator.company?.name : data.operator.company;
          formValues.companyName = compName || '';
        }
        else if (data.role === 'MOTORISTA' && data.driver) {
          formValues.cnh = data.driver.cnh || '';
          formValues.status = data.driver.status || 'ATIVO';
          formValues.photoUrl = data.driver.photoUrl || '';
          // Formata data para input date (YYYY-MM-DD)
          if (data.driver.toxicologyExam) {
            formValues.toxicologyExam = new Date(data.driver.toxicologyExam).toISOString().split('T')[0];
          }
        }

        setFormData(prev => ({ ...prev, ...formValues }));

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Manipuladores de Mudança
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ 
        ...prev, 
        selectedFile: file,
        photoUrl: URL.createObjectURL(file) // Preview
      }));
    }
  };

  // 3. Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Cenário Motorista (FormData por causa da foto)
      if (userRole === 'MOTORISTA') {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('cnh', formData.cnh);
        payload.append('status', formData.status);
        if (formData.password) payload.append('password', formData.password);
        if (formData.toxicologyExam) payload.append('toxicologyExam', new Date(formData.toxicologyExam).toISOString());
        if (formData.selectedFile) payload.append('file', formData.selectedFile);

        await profileService.updateDriverFormData(userId, payload);
      } 
      // Cenário JSON (Admin, Company, Operator)
      else {
        // Copia tudo e remove campos inúteis ou vazios
        const payload: any = {
          name: formData.name,
          email: formData.email,
        };

        if (formData.password) payload.password = formData.password;

        if (userRole === 'ADMIN') {
          payload.region = formData.region;
          payload.cpf = formData.cpf;
          payload.cnpj = formData.cnpj;
        } 
        else if (userRole === 'COMPANY') {
          payload.cnpj = formData.cnpj;
          payload.phone = formData.phone;
          payload.address = formData.address;
          payload.city = formData.city;
          payload.state = formData.state;
          payload.zipCode = formData.zipCode;

        } 
        else if (userRole === 'OPERADOR') {
          payload.region = formData.region;
          payload.cpf = formData.cpf;
          // companyName geralmente é read-only vindo do relacionamento, 
          // mas se sua API permitir editar, descomente:
          // payload.companyName = formData.companyName; 
        }

        await profileService.updateUserJson(userId, payload, userRole);
      }

      alert('Perfil atualizado com sucesso!');
      setFormData(prev => ({ ...prev, password: '' })); // Limpa senha

    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar perfil. Verifique os dados.');
    } finally {
      setSaving(false);
    }
  };

  // --- Renderizadores de Campos Específicos ---

  const renderAdminInputs = () => (
    <>
      <Input label="Região" name="region" value={formData.region} onChange={handleChange} icon={<MapPin />} />
      <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} icon={<FileText />} />
      <Input label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} icon={<Building />} />
    </>
  );

  const renderCompanyInputs = () => (
    <>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} icon={<FileText />} />
        <Input label="Telefone" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone />} />
      </div>
      
      <div className="md:col-span-2 border-t border-gray-100 my-2 pt-4">
        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Home size={16}/> Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
           <div className="md:col-span-3">
             <Input label="Logradouro" name="address" value={formData.address} onChange={handleChange} />
           </div>
           <div className="md:col-span-2">
             <Input label="Cidade" name="city" value={formData.city} onChange={handleChange} />
           </div>
           <div className="md:col-span-1">
             <Input label="UF" name="state" value={formData.state} onChange={handleChange} />
           </div>
           <div className="md:col-span-2">
             <Input label="CEP" name="zipCode" value={formData.zipCode} onChange={handleChange} />
           </div>
        </div>
      </div>
    </>
  );

  const renderOperatorInputs = () => (
    <>
      <Input label="Empresa (Nome)" name="companyName" value={formData.companyName} onChange={handleChange} icon={<Building />} disabled />
      <Input label="Região" name="region" value={formData.region} onChange={handleChange} icon={<MapPin />} />
      <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} icon={<FileText />} />
    </>
  );

  const renderDriverInputs = () => (
    <>
      <Input label="CNH" name="cnh" value={formData.cnh} onChange={handleChange} icon={<IdCard />} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div className="relative">
           <Activity className="absolute left-3 top-3 text-gray-400" size={18} />
           <select 
             name="status" 
             value={formData.status} 
             onChange={handleChange} 
             className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
           >
             <option value="ATIVO">ATIVO</option>
             <option value="INATIVO">INATIVO</option>
             <option value="SUSPENSO">SUSPENSO</option>
           </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Exame Toxicológico</label>
        <div className="relative">
           <Pill className="absolute left-3 top-3 text-gray-400" size={18} />
           <input type="date" name="toxicologyExam" value={formData.toxicologyExam} onChange={handleChange} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
    </>
  );

  // --- Temas de Cor ---
  const getThemeColor = () => {
    switch(userRole) {
        case 'ADMIN': return 'violet';
        case 'COMPANY': return 'teal';
        case 'OPERADOR': return 'indigo';
        case 'MOTORISTA': return 'blue';
        default: return 'gray';
    }
  }
  const themeColor = getThemeColor();

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="mx-auto min-h-full p-6 max-w-5xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Dinâmico */}
        <div className={`h-32 relative bg-gradient-to-r from-${themeColor}-600 to-${themeColor}-800 flex justify-center items-center`}>
          <div className="flex flex-col justify-center items-center text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User /> {formData.name}
            </h1>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide">
                {userRole}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0">
          
          {/* Avatar (Editável apenas para motorista) */}
          <div className="flex justify-center -mt-12 mb-8">
            <div className="relative group">
              {userRole === 'MOTORISTA' && (
                <input type="file" id="profile-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
              )}
              
              <label 
                htmlFor={userRole === 'MOTORISTA' ? "profile-upload" : undefined} 
                className={`w-28 h-28 rounded-full border-4 border-white bg-gray-100 shadow-md flex items-center justify-center overflow-hidden relative ${userRole === 'MOTORISTA' ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className={`text-${themeColor}-400`} />
                )}
                {userRole === 'MOTORISTA' && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs">
                    <Camera size={20} className="mb-1" /> Alterar
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. DADOS DE ACESSO (Comuns) */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Shield size={16} /> Credenciais
              </h3>
              
              <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} icon={<User />} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} icon={<Mail />} />
              <Input label="Nova Senha" name="password" type="password" value={formData.password} onChange={handleChange} icon={<Lock />} placeholder="Preencha apenas se quiser alterar" />
            </div>

            {/* 2. DADOS ESPECÍFICOS */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Briefcase size={16} /> Dados Profissionais
              </h3>
              
              {userRole === 'ADMIN' && renderAdminInputs()}
              {userRole === 'COMPANY' && renderCompanyInputs()}
              {userRole === 'OPERADOR' && renderOperatorInputs()}
              {userRole === 'MOTORISTA' && renderDriverInputs()}

            </div>
          </div>

          <div className="mt-10 flex justify-end pt-6 border-t border-gray-100">
            <button 
                type="submit" 
                disabled={saving} 
                className={`flex items-center gap-2 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {saving ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Salvar Alterações</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Componente Helper de Input para limpar o JSX
const Input = ({ label, name, value, onChange, icon, type = "text", placeholder, disabled = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
       {icon && React.cloneElement(icon, { size: 18, className: "absolute left-3 top-3 text-gray-400" })}
       <input 
         type={type}
         name={name}
         value={value} 
         onChange={onChange} 
         disabled={disabled}
         placeholder={placeholder}
         className={`w-full ${icon ? 'pl-10' : 'p-2.5'} p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors`} 
       />
    </div>
  </div>
);