import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, User, Truck, Phone } from 'lucide-react';

export default function PublicDriverInfo() {
  const { token } = useParams(); // Pega o ID da URL (ex: 123)
  const [loading, setLoading] = useState(true);
  
  // Simulação de dados (depois virá do Backend)
  // Aqui fingimos que se o ID for '1', está tudo ok. Se for outro, dá erro.
  const mockData = {
    isValid: token === '1', 
    driverName: "Carlos Silva",
    driverPhoto: "https://ui-avatars.com/api/?name=Carlos+Silva&background=0D8ABC&color=fff&size=200", // Avatar gerado
    vehicle: "Fiat Fiorino",
    plate: "ABC-1234",
    company: "Transportadora Rápida Ltda",
    status: token === '1' ? "EM ROTA AUTORIZADA" : "NÃO AUTORIZADO / FORA DE HORÁRIO",
    lastUpdate: "30/12/2025 às 08:15"
  };

  useEffect(() => {
    // Simula um delay de carregamento de rede
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      {/* Cabeçalho da Empresa */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
        <div className={`h-24 ${mockData.isValid ? 'bg-green-600' : 'bg-red-600'} flex items-center justify-center`}>
          {mockData.isValid ? (
            <CheckCircle className="text-white w-12 h-12" />
          ) : (
            <XCircle className="text-white w-12 h-12" />
          )}
        </div>

        <div className="px-6 py-8 text-center -mt-12">
          {/* Foto do Motorista */}
          <div className="relative inline-block">
            <img 
              src={mockData.driverPhoto} 
              alt="Motorista" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto bg-slate-200"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">{mockData.driverName}</h2>
          <p className="text-gray-500 font-medium">{mockData.company}</p>

          {/* Status Badge */}
          <div className={`mt-4 inline-block px-4 py-2 rounded-full font-bold text-sm ${
            mockData.isValid 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {mockData.status}
          </div>
        </div>

        {/* Detalhes do Veículo */}
        <div className="border-t border-gray-100 bg-slate-50 px-6 py-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Truck className="text-slate-400" size={20} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Veículo</p>
                <p className="font-semibold text-gray-700">{mockData.vehicle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase">Placa</p>
              <p className="font-mono font-bold text-slate-800 text-lg">{mockData.plate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <User className="text-slate-400" size={20} />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">CNH</p>
              <p className="font-semibold text-gray-700">***.456.789-**</p>
            </div>
          </div>
        </div>

        {/* Rodapé / Botão de Emergência */}
        <div className="p-6 bg-white border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-4">Validado em: {mockData.lastUpdate}</p>
          {!mockData.isValid && (
            <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
              <Phone size={18} />
              Reportar Irregularidade
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm">Powered by FrotaGest</p>
    </div>
  );
}