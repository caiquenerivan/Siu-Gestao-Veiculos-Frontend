import { Edit, Eye, Search, Trash, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"; // Removido QrCode, adicionado Briefcase/FileText
import { useEffect, useState } from "react";
import type { Operator, OperatorsResponse, PaginationMeta, CreateOperatorData } from "../../types";
import { api } from "../../services/api"; // Assumindo existência do operatorService
import OperatorCreateModal from "../../components/Operator/CreateOperator";
import OperatorInfoModal from "../../components/Operator/OperatorInfoModal";
import OperatorUpdateModal from "../../components/Operator/EditOperator";
import { operatorService } from "../../services/operatorService";
import { useAuth } from "../../contexts/AuthContext";

export const OperatorList: React.FC = () => {
  // --- Estados Tipados ---
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Paginação
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [infoOperator, setInfoOperator] = useState<Operator | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {user} = useAuth();
  
  const LIMIT = 10;

  // --- Função de Busca ---
  const fetchOperators = async () => {
    setLoading(true);
    try {
      let response;
      let companyId = user?.companyId;
      // O axios.get recebe o tipo <DriversResponse> para o TS entender o retorno
      if(user?.role === 'ADMIN'){

        response = await api.get<OperatorsResponse>(`/operators?page=${page}&limit=${LIMIT}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });      
      } else if ((user?.role === 'COMPANY' || user?.role === 'OPERADOR')&& companyId){
        response = await operatorService.findByCompanyId(companyId)
      }
      
      const listaDeOperadores = response?.data.data || [];
      
      setOperators(listaDeOperadores);
      if (response?.data.meta) {
        setMeta({
          total: response.data.meta.total,
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          // AQUI ESTÁ A CORREÇÃO:
          // Se lastPage for undefined, usa 1 como padrão
          lastPage: response.data.meta.lastPage ?? 1, 
        });
      }
    } catch (error) {
      console.error("Erro ao buscar operadores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [page]);

  // --- Helpers ---
  


  const handleViewDetails = (operator: Operator) => {
    setInfoOperator(operator);
    setIsDetailsOpen(true);
  };

  const handleDeleteOperator = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este operador?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      // Assumindo operatorService
      await operatorService.delete(id);
      alert('Operador deletado com sucesso!');
      fetchOperators();
    } catch (error) {
      console.error("Erro ao deletar operador:", error);
      alert('Erro ao deletar operador. ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOperator = async (data: CreateOperatorData) => {
    setLoading(true);
    try {
      await operatorService.create(data);
      alert('Operador criado com sucesso!');
      setIsCreateModalOpen(false);
      fetchOperators();
    } catch (error) {
      console.error("Erro ao criar operador:", error);
      alert('Erro ao criar operador. ' + error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenEditModal = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsEditModalOpen(true);
  };

  // Update para Operadores (Geralmente JSON, sem upload de foto obrigatório aqui)
  const handleSaveUpdate = async (data: any) => {
    if (!selectedOperator) return;
    
    setLoading(true);
    try {
      // Para Operadores, montamos um JSON simples ao invés de FormData
      // A menos que você permita upload de foto para operador também, aí manteria o FormData
      const payload = {
        name: data.name,
        email: data.email,
        company: data.company,
        region: data.region,
        type: data.type,
        cpf: data.type === 'PF' ? data.cpf : undefined,
        cnpj: data.type === 'PJ' ? data.cnpj : undefined,
      };

      // Se tiver senha preenchida
      if (data.password && data.password.trim() !== '') {
        (payload as any).password = data.password;
      }

      await api.patch(`/operators/${selectedOperator.id}`, payload);

      alert('Operador atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchOperators();
    } catch (error) {
      console.error("Erro ao atualizar operador:", error);
      alert('Erro ao atualizar operador.');
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
            <h1 className="text-2xl font-bold text-gray-800">Operadores</h1>
            <p className="text-gray-500 text-sm">Gerencie a equipe operacional e logística</p>
          </div>
          
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
            + Adicionar Operador
          </button>
        </div>

        {/* Card da Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">
              Carregando equipe...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="p-4">Operador</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Empresa</th>
                    <th className="p-4">Documento</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {operators?.map((op) => (
                    <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Nome e Email */}
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{op.user.name}</div>
                        <div className="text-gray-500 text-xs">{op.user.email}</div>
                      </td>


                      {/* Empresa e Região */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                           <div className="p-1.5 bg-gray-100 rounded text-gray-600">
                              <Briefcase size={14} />
                           </div>
                           <div>

                              <div className="text-xs text-gray-500">{op.region || 'Sem região'}</div>
                           </div>
                        </div>
                      </td>
                      {/* Botões de Ação (SEM QR CODE) */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            title="Ver Dados" 
                            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                            onClick={() => handleViewDetails(op)}
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleOpenEditModal(op)}
                            title="Editar Dados" 
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>

                          <button 
                            onClick={() => handleDeleteOperator(op.id)}
                            title="Deletar Operador" 
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
          {!loading && operators.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">Nenhum operador encontrado</h3>
              <p className="text-gray-500 text-sm mt-1">Tente adicionar um novo membro à equipe.</p>
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

      {isCreateModalOpen && (
        <OperatorCreateModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateOperator}  
          isLoading={loading}        
        />
      )}

      {infoOperator && (
        <OperatorInfoModal
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          operator={infoOperator} 
        />
      )}      

      {isEditModalOpen && (
        <OperatorUpdateModal 
          operator={selectedOperator}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedOperator(null);
          }}
          onSave={handleSaveUpdate}
          isLoading={loading}        
        />
      )}
    </div>
  );
};