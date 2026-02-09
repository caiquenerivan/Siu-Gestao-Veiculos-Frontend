import { Edit, Eye, Search, Trash, Building2, ChevronLeft, ChevronRight, Phone, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
// Certifique-se de ter esses tipos definidos ou ajuste os imports
import type { Company, PaginationMeta } from "../../types"; 
import { companyService } from "../../services/companyService"; 

// Importe seus modais de Empresa (Assumindo que você criará ou já tem)
import CompanyCreateModal from "../../components/Company/CreateCompany";
import CompanyUpdateModal from "../../components/Company/EditCompany";
import CompanyInfoModal from "../../components/Company/CompanyInfo"; // Opcional

export const CompanyList: React.FC = () => {
  // --- Estados ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Paginação
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  //const [infoCompany, setInfoCompany] = useState<Company | null>(null); // Se tiver modal de detalhes

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Se tiver modal de detalhes
  
  const LIMIT = 10;

  // --- Busca de Dados (Simplificada para Admin) ---
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Como é apenas ADMIN, chamamos a rota global de empresas
      const response = await companyService.findMany(page, LIMIT);
      
      // Tratamento para garantir array (mesma lógica do seu OperatorList)
      const listaDeEmpresas = (response?.data  as any).data || response?.data || [];
      
      setCompanies(listaDeEmpresas);
      const metaData = response.data.meta;

      if (metaData) {
        setMeta({
          total: response.data.meta.total,
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          lastPage: response.data.meta.lastPage ?? 1, 
        });
      }
    } catch (error) {
      console.error("Erro ao buscar empresas", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  // --- Handlers ---

  const handleDeleteCompany = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta empresa? Isso pode remover operadores e veículos vinculados.");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await companyService.delete(id); // Assumindo delete no service
      alert('Empresa deletada com sucesso!');
      fetchCompanies(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
      alert('Erro ao deletar empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (data: any) => {
    setLoading(true);
    try {
      await companyService.create(data);
      alert('Empresa criada com sucesso!');
      setIsCreateModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
      alert('Erro ao criar empresa. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUpdate = async (data: any) => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
        const payload = {...data}
        if (!payload.password || payload.password.trim() === '') {
            delete payload.password;
        }
        await companyService.update(selectedCompany.id, payload);
        alert('Empresa atualizada com sucesso!');
        setIsEditModalOpen(false);
        setSelectedCompany(null);
        fetchCompanies();
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);
        alert('Erro ao atualizar empresa.');
    } finally {
        setLoading(false);
    }
  };

  const handleDetailsOpen = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailsOpen(true)
  }

  const handleOpenEditModal = (company: Company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  // --- Renderização ---

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="text-teal-600" /> Empresas Parceiras
            </h1>
            <p className="text-gray-500 text-sm">Gerencie as empresas e frota terceirizada</p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
          >
            <Building2 size={18} /> + Nova Empresa
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">
              <Loader2 className="animate-spin mx-auto mb-2" />
              Carregando empresas...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="p-4">Empresa</th>
                    <th className="p-4">CNPJ</th>
                    <th className="p-4">Localização</th>
                    <th className="p-4">Contato</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {companies?.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Nome e Email */}
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{company.user?.name}</div>
                        <div className="text-gray-500 text-xs">{company.user?.email}</div>
                      </td>

                      {/* CNPJ */}
                      <td className="p-4 font-mono text-gray-600 text-xs">
                        {company.user?.cnpj || 'Não informado'}
                      </td>

                      {/* Localização */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                           <MapPin size={14} className="text-gray-400" />
                           <span className="text-xs">
                             {company.city ? `${company.city}/${company.state}` : 'Endereço n/d'}
                           </span>
                        </div>
                      </td>

                      {/* Contato/Telefone */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                           <Phone size={14} className="text-gray-400" />
                           <span className="text-xs">{company.phone || '-'}</span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Botão Detalhes (Opcional) */}
                          <button 
                            onClick={() => handleDetailsOpen(company)}
                            title="Ver Detalhes" 
                            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button> 
                          
                          <button 
                            onClick={() => handleOpenEditModal(company)}
                            title="Editar Empresa" 
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>

                          <button 
                            onClick={() => handleDeleteCompany(company.id)}
                            title="Deletar Empresa" 
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
          {!loading && companies.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">Nenhuma empresa encontrada</h3>
              <p className="text-gray-500 text-sm mt-1">Cadastre parceiros para gerenciar a frota.</p>
            </div>
          )}

          {/* Paginação */}
          <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando página <strong>{meta?.page || 1}</strong> de <strong>{meta?.lastPage || 1}</strong>
              <span className="mx-2 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Total: {meta?.total || 0} registros</span>
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

      {/* Modais */}
      {isCreateModalOpen && (
        <CompanyCreateModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateCompany}  
          isLoading={loading}        
        />
      )}

      {isEditModalOpen && selectedCompany && (
        <CompanyUpdateModal 
          company={selectedCompany}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCompany(null);
          }}
          onSave={handleSaveUpdate}
          isLoading={loading}        
        />
      )}

      {isDetailsOpen && selectedCompany && (
        <CompanyInfoModal 
          company={selectedCompany}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedCompany(null);
          }}     
        />
      )}
        
    </div>
  );
};