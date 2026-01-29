import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Lock, Camera, Save, Briefcase, 
  IdCard, Pill, Loader2, Shield, MapPin, FileText, Building 
} from 'lucide-react';
import { profileService } from '../../services/api';

// --- Tipos baseados no seu Schema Prisma ---
interface AdminProfile {
  id: string;
  company: string | null;
  region: string | null;
  cpfCnpj: string | null;
}

interface OperatorProfile {
  id: string;
  type: string | null; // "CLT" | "PJ"
  company: string | null;
  region: string | null;
  cpf: string | null;
  cnpj: string | null;
}

interface DriverProfile {
  id: string;
  cnh: string;
  status: string;
  photoUrl: string | null;
  company: string | null;
  toxicologyExam: string | null;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERADOR' | 'MOTORISTA'; // Tipagem estrita das roles
  // Relacionamentos opcionais
  admin?: AdminProfile;
  operator?: OperatorProfile;
  driver?: DriverProfile;
}


export const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // --- Estados Comuns ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Estados Específicos (Compartilhados entre roles para simplificar) ---
  const [company, setCompany] = useState('');
  const [region, setRegion] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState(''); // Para Admin
  const [cpf, setCpf] = useState('');         // Para Operator
  const [cnpj, setCnpj] = useState('');       // Para Operator
  const [operatorType, setOperatorType] = useState('CLT'); // Para Operator
  
  // --- Estados Exclusivos de Driver ---
  const [cnh, setCnh] = useState('');
  const [toxicology, setToxicology] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');


  //const useId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : null;
  // 1. Função de busca de dados (fora do useEffect para ser acessível globalmente no componente)
  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const userData = await profileService.getMe();
      setUser(userData);
      
      // Popula campos básicos
      setName(userData.name);
      setEmail(userData.email);

      // --- Lógica de Preenchimento baseada na Role ---
      if (userData.role === 'ADMIN' && userData.admin) {
          setCompany(userData.admin.company || '');
          setRegion(userData.admin.region || '');
          setCpfCnpj(userData.admin.cpfCnpj || '');
      } 
      else if (userData.role === 'OPERADOR' && userData.operator) {
          setCompany(userData.operator.company || '');
          setRegion(userData.operator.region || '');
          setCpf(userData.operator.cpf || '');
          setCnpj(userData.operator.cnpj || '');
          setOperatorType(userData.operator.type || 'CLT');
      }
      else if (userData.role === 'MOTORISTA' && userData.driver) {
          setCompany(userData.driver.company || '');
          setCnh(userData.driver.cnh);
          const date = userData.driver.toxicologyExam;
          setToxicology(date ? new Date(date).toISOString().split('T')[0] : '');
          setPreviewUrl(userData.driver.photoUrl || '');
      }
    } catch (error) {
      console.error("Erro ao carregar perfil", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Carregar Perfil
  useEffect(() => {
    fetchData();
    const loadData = async () => {
      try {
        const userData = await profileService.getMe();
        setUser(userData);
        
        // Popula campos básicos
        setName(userData.name);
        setEmail(userData.email);

        // --- Lógica de Preenchimento baseada na Role ---
        if (userData.role === 'ADMIN' && userData.admin) {
            setCompany(userData.admin.company || '');
            setRegion(userData.admin.region || '');
            setCpfCnpj(userData.admin.cpfCnpj || '');
        } 
        else if (userData.role === 'OPERATOR' && userData.operator) {
            setCompany(userData.operator.company || '');
            setRegion(userData.operator.region || '');
            setCpf(userData.operator.cpf || '');
            setCnpj(userData.operator.cnpj || '');
            setOperatorType(userData.operator.type || 'CLT');
        }
        else if (userData.role === 'DRIVER' && userData.driver) {
            setCompany(userData.driver.company || '');
            setCnh(userData.driver.cnh);
            setToxicology(userData.driver.toxicologyExam ? new Date(userData.driver.toxicologyExam).toISOString().split('T')[0] : '');
            setPreviewUrl(userData.driver.photoUrl || '');
        }

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handler de Foto (Apenas Driver)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Submit Inteligente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    setSaving(true);

    try {
      // --- CENÁRIO: MOTORISTA (Usa FormData para foto) ---
      if (user.role === 'MOTORISTA' && user.driver) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('cnh', cnh);
        formData.append('company', company);
        formData.append('status', user.driver.status); 
        
        if (password) formData.append('password', password);
        if (toxicology) formData.append('toxicologyExam', new Date(toxicology).toISOString());
        if (selectedFile) formData.append('file', selectedFile);

        await profileService.updateDriverFormData(user.driver.id, formData);
      } 
      
      // --- CENÁRIO: ADMIN ou OPERADOR (Usa JSON) ---
      else {
        // Objeto base

        const payload: any = {
            name: name,
            email: email,
        };
        if (password) payload.password = password;

        if (user.role === 'ADMIN') {
        payload.company = company;
        payload.region = region;
        payload.cpfCnpj = cpfCnpj;
      }

      // 3. Se for OPERATOR, adicionamos os campos dele
      if (user.role === 'OPERADOR') {
        payload.type = operatorType;
        payload.company = company;
        payload.region = region;
        payload.cpf = cpf;
        payload.cnpj = cnpj;
      }

      // Agora enviamos o 'payload' que acabamos de definir
      // Certifique-se de que sua api.ts está esperando esse formato
      await profileService.updateUserJson(user.id, payload);
        
      }
      await fetchData(true);


      alert('Perfil atualizado com sucesso!');
      setPassword(''); 
      
      // Atualiza header
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ 
        ...storedUser, 
        name: name,
        photoUrl: previewUrl // Caso seja motorista e tenha trocado a foto
      }));

    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar. Verifique os dados.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <p className="p-10 text-center">Usuário não encontrado.</p>;

  const isDriver = user.role === 'MOTORISTA';

  return (
    <div className="mx-auto min-h-full p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Visual */}
        <div className={`h-32 relative bg-gradient-to-r flex justify-center items-center ${
            user.role === 'ADMIN' ? 'from-purple-800 to-indigo-900' :
            user.role === 'OPERADOR' ? 'from-teal-700 to-emerald-800' :
            'from-blue-700 to-blue-900'
        }`}>
          <div className=" flex flex-col justify-center items-center bottom-4 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User /> {user.name}
            </h1>
            <p className="text-xs text-gray-200 opacity-80 mt-1">
                {user.role === 'ADMIN' && 'Administrador do Sistema'}
                {user.role === 'OPERADOR' && 'Operador'}
                {user.role === 'MOTORISTA' && 'Motorista'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0">
          
          {/* Área da Foto */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="relative group">
              {isDriver && (
                <input type="file" id="profile-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
              )}
              
              <label 
                htmlFor={isDriver ? "profile-upload" : undefined} 
                className={`w-32 h-32 rounded-full border-4 border-white bg-gray-100 shadow-md flex items-center justify-center overflow-hidden relative ${isDriver ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
                {isDriver && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs">
                    <Camera size={24} className="mb-1" />
                    Alterar
                  </div>
                )}
              </label>
            </div>

            <div className="flex gap-2">
               <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase">
                 {user.role}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ============================================== */}
            {/* LADO ESQUERDO: CREDENCIAIS (Todos têm)         */}
            {/* ============================================== */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Shield size={16} /> Acesso
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                   <User className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alterar Senha</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Deixe vazio para manter" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* ============================================== */}
            {/* LADO DIREITO: DADOS ESPECÍFICOS POR ROLE       */}
            {/* ============================================== */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Briefcase size={16} /> Dados Profissionais
              </h3>

              {/* --- CASO 1: ADMIN --- */}
              {user.role === 'ADMIN' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input value={company} onChange={e => setCompany(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input value={region} onChange={e => setRegion(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                    </div>
                </>
              )}

              {/* --- CASO 2: OPERATOR --- */}
              {user.role === 'OPERADOR' && (
                <>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select value={operatorType} onChange={e => setOperatorType(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ</option>
                            </select>
                        </div>
                        <div className="flex-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                             <input value={region} onChange={e => setRegion(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input value={company} onChange={e => setCompany(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                    </div>
                    {operatorType === 'CLT' ? (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input value={cpf} onChange={e => setCpf(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>
                         </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input value={cnpj} onChange={e => setCnpj(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>
                         </div>
                    )}
                </>
              )}

              {/* --- CASO 3: DRIVER --- */}
              {user.role === 'MOTORISTA' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNH</label>
                    <div className="relative">
                       <IdCard className="absolute left-3 top-3 text-gray-400" size={18} />
                       <input value={cnh} onChange={e => setCnh(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Frota</label>
                    <div className="relative">
                       <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                       <input value={company} onChange={e => setCompany(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade Toxicológico</label>
                    <div className="relative">
                       <Pill className="absolute left-3 top-3 text-gray-400" size={18} />
                       <input type="date" value={toxicology} onChange={e => setToxicology(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end pt-6 border-t border-gray-100">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              {saving ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Salvar Alterações</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};