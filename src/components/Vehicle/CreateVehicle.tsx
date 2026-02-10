import React, { useEffect, useState } from 'react';
import { X, Hash, Palette, Calendar, Plus, Loader2, User, Building2 } from 'lucide-react';
import { statusCarOptions, yearCarOptions} from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { driverService } from '../../services/driverService';
import { operatorService } from '../../services/operatorService';

// Tipos simplificados
interface SimpleDriver {
  id: string;
  user: { name: string, id: string };
  cnh: string;
}

export interface SimpleCompany {
  id: string;
  user: { name: string; email: string };
  cnpj: string;
}

interface VehicleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const VehicleCreateModal: React.FC<VehicleCreateModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    model: '',
    plate: '',
    brand: '',
    color: '',
    year: '',
    status: 'REGULAR',
    licensingDate: '',
    renavam: '',
    ownerName: '',
    driverId: '',
    companyId: '',
  });

  const [drivers, setDrivers] = useState<SimpleDriver[]>([]);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Helper seguro para extrair listas
  const extractList = (response: any) => {
    return response?.data?.data || response?.data || [];
  };

  useEffect(() => {
    if (isOpen && user) {
      const fetchData = async () => {
        setLoadingData(true);
        console.log(user);
        
        try {
          if (user.role === 'ADMIN') {
            const [driversRes, companiesRes] = await Promise.all([
              api.get('/drivers', { params: { limit: 100 } }),
              api.get('/companies', { params: { limit: 100 } })
            ]);
            setDrivers(extractList(driversRes));
            setCompanies(extractList(companiesRes));
          }
          
          else if (user.role === 'COMPANY' && user.companyId) {
            const companyDriversRes = await driverService.findByCompanyId(user.companyId);
            setDrivers(extractList(companyDriversRes));
            setCompanies([]);
            setFormData(prev => ({ ...prev, companyId: user.companyId || '' }));
          } 
          
          else if (user.role === 'OPERADOR') {
            const response = await operatorService.findByUserId(user.id);
            // Verifica se a resposta veio aninhada ou direta
            const operatorData = response;
            const idCompany = operatorData.companyId || '';
            
            if (idCompany) {
              const companyDriversRes = await driverService.findByCompanyId(idCompany);
              setDrivers(extractList(companyDriversRes));
            }
            
            setFormData(prev => ({ ...prev, companyId: idCompany || '' }));
          }
          
          // --- CORREÇÃO PRINCIPAL AQUI ---
          else if (user.role === 'MOTORISTA' && user.driverId) {
            try {
              const response = await driverService.findById(user.driverId);
              const data = response;
  
              console.log("Dados do Motorista (Debug):", data); // <--- Verifique isso no console do navegador
              
              let realDriverId = '';
              let realCompanyId = '';
  
              // LÓGICA DE PROTEÇÃO: Descobre onde está o ID correto
              if (data.cnh) {
                // Cenário A: A API retornou o objeto Driver direto
                realDriverId = data.id;
                realCompanyId = data.companyId;
              } else if (data) {
                 // Cenário B: A API retornou o objeto User com o Driver dentro
                console.log(data.id);
                console.log(user.id);
                
                
                realDriverId = data.id;
                realCompanyId = data.companyId;
              } else {
                  // Cenário C: Algo errado, talvez precise incluir a relação no backend
                  console.error("ERRO: Não encontrei dados do motorista no objeto:", data);
              }
              setFormData(prev => ({ 
                ...prev, 
                driverId: realDriverId,
                companyId: realCompanyId || ''
              }));
            } catch (error) {
              console.warn("Perfil de motorista não encontrado. O usuário precisa completar o cadastro.");
            }


          }

        } catch (error) {
          console.error("Erro ao carregar listas:", error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();

      // Reset do form ao abrir
      // Se NÃO for motorista, limpa tudo. Se FOR motorista, mantém o ID que o useEffect vai setar.
      if (user.role !== 'MOTORISTA') {
        setFormData({
          brand: '', model: '', plate: '', renavam: '', year: '', color: '', status: statusCarOptions[0]?.value || 'REGULAR',
          driverId: '', companyId: user.companyId || '', licensingDate: '', ownerName: ''
        });
      } else {
        // Limpa apenas campos de texto
         setFormData(prev => ({
          ...prev,
          brand: '', model: '', plate: '', renavam: '', year: '', color: '', status: statusCarOptions[0]?.value || 'REGULAR',
          licensingDate: '', ownerName: ''
        }));
      }
    }
  }, [isOpen, user]); // Removi dependências excessivas para evitar loops

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparação Robusta do Payload
    const payload = {
      ...formData,
      // Converte Ano para Número (bancos geralmente esperam Int)
      year: formData.year || undefined, 
      // Garante que string vazia vire NULL/Undefined para evitar erro de Foreign Key
      driverId: formData.driverId || null,
      companyId: formData.companyId || null,
      // Formata data ou envia null
      licensingDate: formData.licensingDate ? new Date(formData.licensingDate).toISOString() : null
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-700 p-6 flex justify-between items-center rounded-t-xl shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Plus size={20} className="bg-white/20 p-0.5 rounded-full" /> Novo Veículo
          </h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Marca *</label>
              <input required name="brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Toyota" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Modelo *</label>
              <input required name="model" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Corolla" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Placa *</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-gray-400" size={16} />
                <input required name="plate" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="ABC-1234" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Renavam *</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-gray-400" size={16} />
                <input required name="renavam" value={formData.renavam} onChange={e => setFormData({...formData, renavam: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="12345678901" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Ano *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <select required name="year" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="" disabled>Selecione</option>
                  {yearCarOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Cor *</label>
              <div className="relative">
                <Palette className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Prata" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Licenciamento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="date" name="licensingDate" value={formData.licensingDate} onChange={e => setFormData({...formData, licensingDate: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Proprietário</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="ownerName" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nome" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider border-b border-indigo-100 pb-1 mt-2">
              Vínculos Operacionais (Opcional)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {user?.role === 'ADMIN' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Building2 size={14} /> Empresa Responsável
                  </label>
                  <select 
                    value={formData.companyId}
                    onChange={e => {
                      setFormData({...formData, companyId: e.target.value, driverId: ''});
                    }}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Sem empresa vinculada</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.user.name} {company.cnpj ? `(${company.cnpj})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select de Motorista (Oculto para MOTORISTA, pois ele já é o motorista) */}
              {user?.role !== 'MOTORISTA' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <User size={14} /> Motorista Principal
                  </label>
                  
                  {loadingData ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 p-2 border rounded-lg bg-gray-50">
                        <Loader2 className="animate-spin" size={16} /> Carregando...
                    </div>
                  ) : (
                    <select 
                      name="driverId"
                      value={formData.driverId}
                      onChange={e => setFormData({...formData, driverId: e.target.value})}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Sem motorista vinculado</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {/* Uso do ?. para evitar erro se user for null */}
                          {driver.user?.name || 'Motorista'} ({driver.cnh})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              
            </div>
            {loadingData && (
              <p className="text-[10px] text-gray-400 italic text-right">
                Carregando dados...
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-xl border-t shrink-0">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleCreateModal;