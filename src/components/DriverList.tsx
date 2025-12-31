import axios from "axios";
import { Car, ChevronLeft, ChevronRight, Edit, QrCode, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

// 2. O que vem dentro de 'vehicle'
interface VehicleData {
  id: string;
  model: string;
  plate: string;
  brand: string;
}

// 3. O objeto Motorista completo
interface Driver {
  id: string;
  cnh: string;
  status: 'PENDENTE' | 'ATIVO' | 'BLOQUEADO'; // Union type para o Enum
  photoUrl?: string; // Opcional
  publicToken: string;
  createdAt: string; // Vem como string ISO do JSON
  user: UserData;    // Relação obrigatória
  vehicle?: VehicleData | null; // Relação opcional (pode ser null)
}

// 4. Metadados da Paginação
interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

// 5. Resposta da API
interface DriversResponse {
  data: Driver[];
  meta: PaginationMeta;
}

export const DriverList: React.FC = () => {
  // --- Estados Tipados ---
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Paginação
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const LIMIT = 10;

  // --- Função de Busca ---
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      // O axios.get recebe o tipo <DriversResponse> para o TS entender o retorno
      const response = await axios.get<DriversResponse>(`http://localhost:3000/drivers?page=${page}&limit=${LIMIT}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setDrivers(response.data.data);
      setMeta(response.data.meta);
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
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      ATIVO: 'bg-green-100 text-green-800 border-green-200',
      BLOQUEADO: 'bg-red-100 text-red-800 border-red-200',
      PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
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
                        {driver.vehicle ? (
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                              <Car size={16} />
                            </div>
                            <div>
                              <div className="font-medium">{driver.vehicle.model}</div>
                              <div className="text-xs text-gray-500">{driver.vehicle.plate}</div>
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
                            onClick={() => alert(`Abrir QR Code: ${driver.publicToken}`)}
                            title="Ver QR Code" 
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <QrCode size={18} />
                          </button>
                          
                          <button 
                            title="Editar Dados" 
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit size={18} />
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
    </div>
  );
};