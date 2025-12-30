import { ClipboardCheck, Truck, AlertTriangle } from 'lucide-react';

export function OperatorDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel Operacional</h2>
      
      {/* Cards de Resumo Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Saídas Hoje</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">8</h3>
            </div>
            <Truck className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Devoluções Pendentes</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">3</h3>
            </div>
            <ClipboardCheck className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Alertas de Manutenção</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">1</h3>
            </div>
            <AlertTriangle className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Área de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="p-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
          <Truck size={48} className="mb-2" />
          <span className="font-semibold">Registrar Nova Saída</span>
        </button>
        <button className="p-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all">
          <ClipboardCheck size={48} className="mb-2" />
          <span className="font-semibold">Registrar Devolução</span>
        </button>
      </div>
    </div>
  );
}