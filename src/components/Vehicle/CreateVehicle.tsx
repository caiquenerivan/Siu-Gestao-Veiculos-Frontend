import React, { useEffect, useState } from 'react';
import { X, Hash, Palette, Calendar, Plus, Loader2, User, Building2 } from 'lucide-react';
import { statusCarOptions, yearCarOptions } from '../../types';
import { api } from '../../services/api';

// Tipos simplificados para os selects (ou importe dos seus types globais)
interface SimpleDriver {
  id: string;
  user: { name: string };
  cnh: string;
}

interface SimpleCompany {
  id: string;
  user: { name: string; email: string }; // Lembre que o nome fica no User
  cnpj: string;
}

interface VehicleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const VehicleCreateModal: React.FC<VehicleCreateModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
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

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoadingData(true);
          // Executa as duas requisições em paralelo
          const [driversRes, companiesRes] = await Promise.all([
            api.get('/drivers?limit=100'),   // Ajuste o limit conforme sua necessidade
            api.get('/companies?limit=100')
          ]);

          setDrivers(driversRes.data.data || []);
          setCompanies(companiesRes.data.data || []);
        } catch (error) {
          console.error("Erro ao carregar listas:", error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
      
      // Reset do form
      setFormData({
        brand: '', model: '', plate: '', renavam: '', year: '', color: '', status: statusCarOptions[0]?.value || 'REGULAR',
        driverId: '', companyId: '', licensingDate: '', ownerName: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpeza: Se o ID for vazio, manda null ou undefined para o backend não quebrar
    const payload = {
      ...formData,
      driverId: formData.driverId || undefined,
      companyId: formData.companyId || undefined
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-700 p-6 flex justify-between items-center rounded-t-xl">
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
                  <option value="" disabled>Selecione o ano</option>
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
              <label className="text-xs font-bold text-gray-500 uppercase">Data de Licenciamento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="date" name="licensingDate" value={formData.licensingDate} onChange={e => setFormData({...formData, licensingDate: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="2024" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nome do Proprietário</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="ownerName" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Prata" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider border-b border-indigo-100 pb-1 mt-2">
              Vínculos Operacionais (Opcional)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Select de Empresa */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Building2 size={14} /> Empresa Responsável
                </label>
                <select 
                  value={formData.companyId}
                  onChange={e => setFormData({...formData, companyId: e.target.value})}
                  disabled={loadingData}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Sem empresa vinculada</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.user.name} 
                      {company.cnpj ? ` (${company.cnpj})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select de Motorista */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <User size={14} /> Motorista Principal
                </label>
                <select 
                  value={formData.driverId}
                  onChange={e => setFormData({...formData, driverId: e.target.value})}
                  disabled={loadingData}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Sem motorista vinculado</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.user.name} ({driver.cnh})
                    </option>
                  ))}
                </select>
              </div>
              
            </div>
            {loadingData && (
              <p className="text-[10px] text-gray-400 italic text-right">
                Carregando lista de vínculos...
              </p>
            )}
          </div>


        </div>

        
        

        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-xl border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleCreateModal;