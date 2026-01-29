import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Palette, Calendar, Building2, User } from 'lucide-react';
import type { Vehicle } from '../../types';
import { api } from '../../services/api';

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

interface VehicleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  vehicle: Vehicle | null;
  isLoading?: boolean;
}

const VehicleUpdateModal: React.FC<VehicleUpdateModalProps> = ({ isOpen, onClose, onSave, vehicle, isLoading }) => {
  const [formData, setFormData] = useState({
    brand: '', model: '', plate: '', licensingDate: '', renavam: '', driverId: '', companyId: '', year: '', color: '', status: '', ownerName: ''
  });

    const [drivers, setDrivers] = useState<SimpleDriver[]>([]);
    const [companies, setCompanies] = useState<SimpleCompany[]>([]);
    const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && vehicle) {
      const fetchData = async () => {
        try {
          setLoadingData(true);
          const [driversRes, companiesRes] = await Promise.all([
            api.get('/drivers?limit=100'),   // Ajuste o limit conforme sua necessidade
            api.get('/companies?limit=100')
          ]);
          console.log(driversRes);
          console.log(companiesRes);
          setDrivers(driversRes.data.data || []);
          setCompanies(companiesRes.data.data || []);
        } catch (error) {
          console.error('Erro ao carregar dados para o formulário:', error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();

      setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        plate: vehicle.plate,
        licensingDate: vehicle.licensingDate 
          ? String(vehicle.licensingDate).split('T')[0] 
          : '',
        renavam: vehicle.renavam,
        driverId: vehicle.driver?.id || '',
        companyId: vehicle.company?.id || '',
        year: vehicle.year,
        color: vehicle.color,
        status: vehicle.status ||'',
        ownerName: vehicle.ownerName,
      });
    }
  }, [isOpen, vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Limpeza: Se o ID for vazio, manda null ou undefined para o backend não quebrar
      const payload = {
        ...formData,
        driverId: formData.driverId,
        companyId: formData.companyId
      };
  
      onSave(payload);
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="h-20 bg-indigo-800 p-6 flex justify-between items-center rounded-t-xl text-white">
          <h2 className="font-bold">Editar Veículo: {vehicle.model} - {vehicle.plate}</h2>
          <button type="button" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Status da Frota</label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="REGULAR">Regular</option>
              <option value="FURTO">Furto</option>
              <option value="IRREGULAR">Irregular</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Proprietário do Veículo</label>
              <input value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Modelo</label>
              <input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-2.5 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Cor</label>
              <div className="relative">
                <Palette className="absolute left-3 top-3 text-gray-400" size={16} />
                <input name="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Prata" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Data de Licenciamento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="date" name="licensingDate" value={formData.licensingDate} onChange={e => setFormData({...formData, licensingDate: e.target.value})} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="2024" />
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
                  <option value={vehicle?.driverId || ''}>{vehicle ? vehicle.driver?.user?.name : 'Sem motorista vinculado'  }</option>
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
          

          
          {/* Adicione outros campos conforme necessário, similar ao Create */}
        </div>

        <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleUpdateModal;