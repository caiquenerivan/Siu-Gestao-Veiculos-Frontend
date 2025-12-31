import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, User, Truck, Phone, AlertOctagon, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function PublicDriverInfo() {
  // Agora pegamos o 'token' da URL, não mais o 'id'
  const { token } = useParams(); 
  
  // Estados possíveis: 'loading', 'found', 'not_found'
  const [pageState, setPageState] = useState<'loading' | 'found' | 'not_found'>('loading');
  
  const [driverData, setDriverData] = useState<any>(null);

  const formatarData = (dataISO: string) => {
  
  // O 'pt-BR' garante o formato dia/mês/ano
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dataISO));
  };

  useEffect(() => {
    async function fetchDriverData() {
      try {
        // Chamada real ao Backend
        const response = await api.get(`/drivers/qrcode/${token}`);
        
        // Se chegou aqui, é sucesso (status 200)
        setDriverData(response.data);
        setPageState('found');

      } catch (error: any) {
        // Se der erro 404, mostramos a tela de "Não Encontrado"
        if (error.response && error.response.status === 404) {
          setPageState('not_found');
        } else {
          // Qualquer outro erro (servidor fora do ar, banco caiu)
          console.error("Erro ao buscar motorista:", error);
          setPageState('not_found'); // Podemos criar uma UI simples pra erro genérico depois
        }
      }
    }

    if (token) {
      fetchDriverData();
    }
  }, [token]);

  // --- TELA 1: CARREGANDO ---
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // --- TELA 2: NÃO ENCONTRADO (O que você pediu) ---
  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border-t-4 border-gray-400">
          <div className="mx-auto bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon size={40} className="text-gray-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Motorista Não Encontrado</h2>
          <p className="text-gray-500 mb-8">
            O QRcode informado não corresponde a nenhum motorista ativo em nossa base de dados.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
            <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-1">
              <HelpCircle size={16} /> O que fazer?
            </h3>
            <p className="text-xs text-blue-700">
              Se você acredita que isso é um erro, por favor, entre em contato com a administração da frota imediatamente.
            </p>
          </div>

          <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
            Entrar em Contato
          </button>
        </div>
        <p className="mt-8 text-slate-400 text-sm">Sistema FrotaGest</p>
      </div>
    );
  }

  // --- TELA 3: MOTORISTA ENCONTRADO (Verde ou Vermelho) ---
  const status = driverData.status;

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
        {/* Header Colorido baseado na autorização */}
        <div className={`h-24 ${status === 'ATIVO' ? 'bg-green-600' : status === 'PENDENTE' ? 'bg-yellow-600' : 'bg-red-600'} flex items-center justify-center transition-colors`}>
          {status === 'ATIVO' ? (
            <CheckCircle className="text-white w-12 h-12" />
          ) : (
            <XCircle className="text-white w-12 h-12" />
          )}
        </div>

        <div className="px-6 py-8 text-center -mt-12">
          <div className="relative inline-block">
            <img 
              src={driverData.photoUrl || '/default-driver.png'} 
              alt={"Foto do Motorista " + driverData.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto bg-slate-200 object-cover"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">{driverData.user.name}</h2>
          <p className="text-gray-500 font-medium">{driverData.company}</p>

          <div className={`mt-4 inline-block px-4 py-2 rounded-full font-bold text-sm ${
            status === 'ATIVO'
              ? 'bg-green-100 text-green-800 border border-green-200' : status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {status === 'ATIVO' ? "MOTORISTA ATIVO NO SISTEMA" : 
              status === 'PENDENTE' ? "MOTORISTA PENDENTE, ENTRE EM CONTATO COM A SUA EMPRESA" : 
              "MOTORISTA NÃO AUTORIZADO, ENTRE EM CONTATO COM A SUA EMPRESA"
            }
          </div>
        </div>

        <div className="border-t border-gray-100 bg-slate-50 px-6 py-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Truck className="text-slate-400" size={20} />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Veículo</p>
                <p className="font-semibold text-gray-700">{driverData?.vehicle?.model || "Veículo não cadastrado"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase">Placa</p>
              <p className="font-mono font-bold text-slate-800 text-lg">{driverData?.vehicle?.plate || "Placa não cadastrada"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <User className="text-slate-400" size={20} />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase ">CNH</p>
              <p className="font-semibold text-gray-700">
                {driverData.cnh}
              </p>
            </div>
            <div className="text-right ml-auto">
              <p className="text-xs text-gray-400 font-bold uppercase">Toxicológico Validade</p>
              <p className="font-semibold text-gray-700">
                {formatarData(driverData.toxicologyExam)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-4">Validado em: {formatarData(driverData.user.updatedAt)}</p>
          <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
            <Phone size={18} />
            Reportar Irregularidade
          </button>
        </div>
      </div>
    </div>
  );
}