export function AdminDashboard() {
  return (
    <div className="space-y-6 w-full">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Operadores Ativos</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">12</h3>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Ativos</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Veículos em Uso</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">5</h3>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Em Rota</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Motoristas</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">48</h3>
            </div>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Cadastrados</span>
          </div>
        </div>
      </div>

      {/* Área de Conteúdo Vazia (Placeholders) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Nenhuma atividade recente</h3>
        <p className="text-gray-500 mt-1">As alocações de veículos aparecerão aqui.</p>
      </div>
    </div>
  );
}