import { 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Eye, 
  Search, 
  Trash, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Imports de Modals (Você criará estes em seguida)
import VehicleCreateModal from "../../components/Vehicle/CreateVehicle";
import VehicleUpdateModal from "../../components/Vehicle/EditVehicle";
import VehicleInfoModal from "../../components/Vehicle/VehicleInfoModal";

import { api, vehicleService } from "../../services/api";
import type { Vehicle, VehiclesResponse, PaginationMeta, CreateVehicleData, UpdateVehicleData } from "../../types";

export const VehicleList: React.FC = () => {
  // --- Estados ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Paginação
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Seleção e Modals
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [infoVehicle, setInfoVehicle] = useState<Vehicle | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const LIMIT = 10;

  // --- Função de Busca ---
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get<VehiclesResponse>(`/vehicles?page=${page}&limit=${LIMIT}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });      
      
      // Proteção para garantir array
      setVehicles(response.data.data || []);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Erro ao buscar veículos", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page]);

  // --- Helpers Visuais ---
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'REGULAR':
        return { style: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Disponível' };
      case 'FURTO':
        return { style: 'bg-red-100 text-red-800 border-red-200', icon: Truck, label: 'Em Uso' };
      case 'IRREGULAR':
        return { style: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle, label: 'Manutenção' };
      default:
        return { style: 'bg-gray-100 text-gray-800', icon: Car, label: status };
    }
  };

  // --- Ações ---
  const handleDeleteVehicle = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja remover este veículo da frota?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await vehicleService.delete(id);
      alert('Veículo removido com sucesso!');
      fetchVehicles();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert('Erro ao deletar veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (data: CreateVehicleData) => {
    setLoading(true);
    try {
      await vehicleService.create(data);
      alert('Veículo cadastrado com sucesso!');
      setIsCreateModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error("Erro ao criar:", error);
      alert('Erro ao criar veículo.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveUpdate = async (data: UpdateVehicleData) => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      await vehicleService.update(selectedVehicle.id, data);
      alert('Veículo atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert('Erro ao atualizar veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setInfoVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  // --- Renderização ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Car className="text-indigo-600" /> Frota de Veículos
            </h1>
            <p className="text-gray-500 text-sm">Gerencie os carros e caminhões da empresa</p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
          >
            <Truck size={18} /> Novo Veículo
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">
              Carregando frota...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="p-4">Veículo</th>
                    <th className="p-4">Placa / Renavam</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Motorista Atual</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {vehicles?.map((vehicle) => {
                    const statusInfo = getStatusConfig(vehicle.status || 'Status Desconhecido');
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Coluna 1: Dados do Carro */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Car size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{vehicle.brand} {vehicle.model}</div>
                                <div className="text-xs text-gray-500 flex gap-2">
                                    <span>{vehicle.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 self-center"></span>
                                    <span>{vehicle.color}</span>
                                </div>
                            </div>
                          </div>
                        </td>

                        {/* Coluna 2: Identificação */}
                        <td className="p-4">
                            <div className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded w-fit text-xs border border-gray-200">
                                {vehicle.plate}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">
                                REN: {vehicle.renavam}
                            </div>
                        </td>

                        {/* Coluna 3: Status */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${statusInfo.style}`}>
                            <StatusIcon size={12} />
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Coluna 4: Motorista Vinculado */}
                        <td className="p-4">
                           {vehicle.driver ? (
                               <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                       {vehicle.driver.user.name.charAt(0)}
                                   </div>
                                   <span className="text-gray-700 font-medium">{vehicle.driver.user.name}</span>
                               </div>
                           ) : (
                               <span className="text-gray-400 italic text-xs">Sem motorista</span>
                           )}
                        </td>

                        {/* Coluna 5: Ações */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(vehicle)}
                              title="Ver Detalhes" 
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Eye size={18} />
                            </button>
                            
                            <button 
                              onClick={() => handleOpenEditModal(vehicle)}
                              title="Editar Veículo" 
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Edit size={18} />
                            </button>

                            <button 
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              title="Remover Veículo" 
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && vehicles?.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">Nenhum veículo encontrado</h3>
              <p className="text-gray-500 text-sm mt-1">Adicione veículos para começar a monitorar sua frota.</p>
            </div>
          )}

          {/* Paginação */}
          <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando página <strong>{meta?.page || 1}</strong> de <strong>{meta?.lastPage || 1}</strong>
              <span className="mx-2 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Total: {meta?.total || 0} veículos</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button
                onClick={() => setPage((p) => (meta ? Math.min(meta.lastPage, p + 1) : p))}
                disabled={!meta || page === meta.lastPage || loading}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
 
      {isCreateModalOpen && (
        <VehicleCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateVehicle}
          isLoading={loading}
        />
      )}

      {isEditModalOpen && selectedVehicle && (
        <VehicleUpdateModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
          onSave={handleSaveUpdate}
          vehicle={selectedVehicle}
          isLoading={loading}
        />
      )}

      {infoVehicle && (
        <VehicleInfoModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          vehicle={infoVehicle}
        />
      )}
    </div>
  );
};