import { Edit, Eye, Trash, ShieldCheck, ChevronLeft, ChevronRight, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import type { PaginationMeta } from "../../types"; 
import { adminService, type Admin } from "../../services/adminService";

import CreateAdminModal from "../../components/Admin/CreateAdmin";
import EditAdminModal from "../../components/Admin/EditAdmin";
import AdminInfoModal from "../../components/Admin/AdminInfo";

export const AdminsList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [infoAdmin, setInfoAdmin] = useState<Admin | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const LIMIT = 10;

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminService.findMany(page, LIMIT);
      
      if (!response) {
        setAdmins([]);
        return;
      }

      const lista = ((response.data as any).data || response.data || []) as Admin[];
      console.log(lista);
      
      setAdmins(lista);
      

      const metaData = (response.data as any).meta;
      if (metaData) {
        setMeta({
          total: response.data.meta.total,
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          lastPage: response.data.meta.lastPage ?? 1, 
        });
      }
    } catch (error) {
      console.error("Erro ao buscar admins", error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza? Esta ação removerá o acesso administrativo.")) return;
    try {
      setLoading(true);
      await adminService.delete(id);
      fetchAdmins();
    } catch (error) {
      alert('Erro ao deletar admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      await adminService.create(data);
      setIsCreateModalOpen(false);
      fetchAdmins();
    } catch (error) {
      alert('Erro ao criar admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      // Remove senha se vazia
      const payload = { ...data };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      
      await adminService.update(selectedAdmin.id, payload);
      setIsEditModalOpen(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error) {
      alert('Erro ao atualizar admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserCog className="text-violet-600" /> Gestão de Administradores
            </h1>
            <p className="text-gray-500 text-sm">Gerencie os usuários com privilégios elevados.</p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
          >
            <ShieldCheck size={18} /> + Novo Admin
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="p-10 text-center text-gray-400">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="p-4">Administrador</th>
                    <th className="p-4">Região</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                             {adm.user.name.charAt(0)}
                           </div>
                           <div>
                             <div>{adm.user.name}</div>
                             <div className="text-gray-500 text-xs">{adm.user.email}</div>
                           </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {adm.region || <span className="text-gray-400 italic">Global</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setInfoAdmin(adm); setIsDetailsOpen(true); }} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => { setSelectedAdmin(adm); setIsEditModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(adm.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

           {/* Paginação */}
           {!loading && admins.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Página {meta?.page} de {meta?.lastPage}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
                <button onClick={() => setPage(p => Math.min(meta?.lastPage || 1, p + 1))} disabled={page === (meta?.lastPage || 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16}/></button>
              </div>
            </div>
           )}
        </div>
      </div>

      {/* Modais */}
      <CreateAdminModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleCreate} isLoading={loading} />
      <EditAdminModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdate} isLoading={loading} admin={selectedAdmin} />
      <AdminInfoModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} admin={infoAdmin} />
    </div>
  );
};