import { Car, ChevronLeft, ChevronRight, Edit, Eye, QrCode, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import DriverQRCodeModal from "../../components/QrCode";
import DriverInfoModal from "../../components/Driver/DriverInfo";
import type { CreateDriverData, Driver, DriversResponse, PaginationMeta } from "../../types";
import DriverCreateModal from "../../components/Driver/CreateDriver";
import { api } from "../../services/api";
import DriverUpdateModal from "../../components/Driver/EditDriver";
import { useAuth } from "../../contexts/AuthContext";
import { driverService } from "../../services/driverService";



export const DriverList: React.FC = () => {
  // --- Estados Tipados ---
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Paginação
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [infoDriver, setInfoDriver] = useState<Driver | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const {user} = useAuth();

  const LIMIT = 10;

  // --- Função de Busca ---
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      let response;
      let companyId = user?.companyId;
      // O axios.get recebe o tipo <DriversResponse> para o TS entender o retorno
      if(user?.role === 'ADMIN'){

        response = await api.get<DriversResponse>(`/drivers?page=${page}&limit=${LIMIT}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });      
      } else if ((user?.role === 'COMPANY' || user?.role === 'OPERADOR')&& companyId){
        response = await driverService.findByCompanyId(companyId)
      }

      const listaDeMotoristas = (response?.data as any).data || response?.data || [];
      const metaData = response?.data.meta;
      
      setDrivers(listaDeMotoristas); 
      if (metaData) {
        setMeta({
          total: metaData.total,
          page: metaData.page,
          limit: metaData.limit,
          // Garante que lastPage seja um número (se vier undefined, usa 1)
          lastPage: metaData.lastPage ?? 1, 
        });
      } else {
        // Se não tiver meta, define como null
        setMeta(null);
      }
    } catch (error) {
      console.error("Erro ao buscar motoristas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [page]);

  // --- Helpers de Formatação ---
  /*
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };
  
  */


  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      ATIVO: 'bg-green-100 text-green-800 border-green-200',
      BLOQUEADO: 'bg-red-100 text-red-800 border-red-200',
      PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (driver: Driver) => {
    setInfoDriver(driver);
    setIsDetailsOpen(true);
  };

  const handleDeleteDriver = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este motorista?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await driverService.delete(id);
      alert('Motorista deletado com sucesso!');
      fetchDrivers();
    } catch (error) {
      console.error("Erro ao deletar motorista:", error);
      alert('Erro ao deletar motorista. ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (data:CreateDriverData) => {
    setLoading(true);
    try {
      await driverService.create(data);
      alert('Motorista criado com sucesso!');
      setIsCreateModalOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error("Erro ao criar motorista:", error);
      alert('Erro ao criar motorista. ' + error);
    } finally {
      setLoading(false);
    }
    // Lógica para abrir modal de criação de motorista
    setIsCreateModalOpen(true);
    console.log("Abrir modal de criação de motorista");
  }

  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditModalOpen(true);
  };
  /*
  const handleUpdateDriver = async (driver: Driver) => {
    setLoading(true);
    try {
      if (!driver) {
        throw new Error('Motorista não selecionado para atualização.');
      }
      const data: UpdateDriverData = {
        name: driver.user.name,
        email: driver.user.email,
        password: '', // Senha vazia, pois não será alterada aqui
        cnh: driver.cnh,
        company: driver.company,
        status: driver.status,
        photoUrl: driver.photoUrl || '',
        toxicologyExam: driver.toxicologyExam ? new Date(driver.toxicologyExam) : null,
      };

      await driverService.update(driver.id, data);
      alert('Motorista atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      alert('Erro ao atualizar motorista. ' + error);
    } finally {
      setLoading(false);
    }
    // Lógica para abrir modal de criação de motorista
    setIsEditModalOpen(true);
    console.log(isEditModalOpen);
  }

  

  const handleSaveUpdate = async (data: UpdateDriverData) => {
    if (!selectedDriver) return;
    
    setLoading(true);
    try {
      await driverService.update(selectedDriver.id, data);
      alert('Motorista atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      alert('Erro ao atualizar motorista.');
    } finally {
      setLoading(false);
    }
  };
  */

  const handleSaveUpdate = async (data: any) => {
    if (!selectedDriver) return;
    
    setLoading(true);
    try {
      const formData = new FormData();

      // 1. Anexa a nova foto se o usuário selecionou uma
      if (data.file instanceof File) {
        formData.append('file', data.file);
      }

      // 2. Anexa os campos de texto "soltos"
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('cnh', data.cnh);
      formData.append('status', data.status);
      if (data.cpf) {
        formData.append('cpf', data.cpf);
      }
      if (data.companyId) {
        formData.append('cpf', data.cpf);
      }
      if (data.toxicologyExam) {
        formData.append('toxicologyExam', new Date(data.toxicologyExam).toISOString());
      }

      // Só envia senha se o usuário digitou algo
      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password);
      }

      // 3. Envia o PATCH
      // Note que não usamos 'jsonData' aqui para simplificar, enviamos tudo solto
      // Se quiser usar jsonData igual no create, teria que agrupar e fazer JSON.stringify
      // Mas meu código do Controller acima (Passo 1) está preparado para receber SOLTO (body.name, body.email...)
      
      await api.patch(`/drivers/${selectedDriver.id}`, formData);

      alert('Motorista atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      alert('Erro ao atualizar motorista.');
    } finally {
      setLoading(false);
    }
  };


  // --- Renderização ---

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Motoristas</h1>
            <p className="text-gray-500 text-sm">Gerencie a frota e os acessos</p>
          </div>
          
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
            + Adicionar Motorista
          </button>
        </div>

        {/* Card da Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            // Skeleton Loading Simples
            <div className="p-10 text-center text-gray-400 animate-pulse">
              Carregando dados da frota...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="p-4">Motorista</th>
                    <th className="p-4">Veículo Atual</th>
                    <th className="p-4">CNH</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Nome e Email */}
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{driver.user.name}</div>
                        <div className="text-gray-500 text-xs">{driver.user.email}</div>
                      </td>

                      {/* Veículo (Com verificação de nulidade via Optional Chaining) */}
                      <td className="p-4">
                        {driver.vehicle && driver.vehicle.length > 0 ? (
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                              <Car size={16} />
                            </div>
                            <div>
                              <div className="font-medium">{driver.vehicle[0].model}</div>
                              <div className="text-xs text-gray-500">{driver.vehicle[0]?.plate}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic flex items-center gap-1">
                            Sem veículo
                          </span>
                        )}
                      </td>

                      {/* CNH */}
                      <td className="p-4 font-mono text-gray-600">{driver.cnh}</td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>

                      {/* Botões de Ação */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            title="Ver Dados" 
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            onClick={() => handleViewDetails(driver)}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => setSelectedDriver(driver)} // <--- AQUI
                            title="Ver QR Code" 
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <QrCode size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleOpenEditModal(driver)}
                            title="Editar Dados" 
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>

                          <button 
                            onClick={() => handleDeleteDriver(driver.id)}
                            title="Deletar Motorista" 
                            className="p-2 text-red-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Estado Vazio */}
          {!loading && drivers.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">Nenhum motorista encontrado</h3>
              <p className="text-gray-500 text-sm mt-1">Tente adicionar um novo registro.</p>
            </div>
          )}

          {/* Rodapé da Paginação */}
          <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando página <strong>{meta?.page}</strong> de <strong>{meta?.lastPage}</strong>
              <span className="mx-2 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Total: {meta?.total} registros</span>
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

      {selectedDriver && (
        <DriverQRCodeModal 
          driver={selectedDriver} 
          onClose={() => setSelectedDriver(null)} 
        />
      )}
      {infoDriver && (

        <DriverInfoModal
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          driver={infoDriver} 
        />
      )
      }

      {isCreateModalOpen && (
        <DriverCreateModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateDriver}  
          isLoading={loading}        
        />
      )}

      {isEditModalOpen && (
        <DriverUpdateModal 
          driver={selectedDriver}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedDriver(null);
          }}
          onSave={handleSaveUpdate}
          isLoading={loading}        
        />
      )}
    </div>
  );
};