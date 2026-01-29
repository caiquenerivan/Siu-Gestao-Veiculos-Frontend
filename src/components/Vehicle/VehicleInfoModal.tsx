import React from 'react';
import { X, Car, User, Hash, Briefcase, Calendar, Palette, FileText, CarFront, CircleAlert } from 'lucide-react';
import type { Vehicle } from '../../types';

interface VehicleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const VehicleInfoModal: React.FC<VehicleInfoModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  const licensingDate = new Date(vehicle.licensingDate).toLocaleDateString('pt-BR');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="h-24 bg-indigo-600 flex items-center justify-center relative">
          <Car size={48} className="text-white/50 absolute left-4 " />
          <h2 className="text-white font-bold text-xl uppercase tracking-widest"> Placa: {vehicle.plate}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Marca / Modelo</p>
              <p className="text-lg font-bold text-gray-800">{vehicle.brand} {vehicle.model}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
              vehicle.status === 'REGULAR' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {vehicle.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Ano</p><p className="text-sm font-medium">{vehicle.year}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Palette className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Cor</p><p className="text-sm font-medium">{vehicle.color}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Renavam</p><p className="text-sm font-medium">{vehicle.renavam}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <CarFront className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Data de Licenciamento</p><p className="text-sm font-medium">{licensingDate}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <CircleAlert className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Status</p><p className="text-sm font-medium">{vehicle.status}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-gray-400" size={20} />
              <div className="flex flex-col w-full"><p className="text-[10px] text-gray-400 uppercase font-bold">Nome do Proprietário</p><p className="text-sm font-medium">{vehicle.ownerName}</p></div>
            </div>

          </div>

          <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-4 border border-indigo-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 uppercase font-bold">Motorista Atual</p>
              <p className="text-sm font-bold text-indigo-900">{vehicle.driver?.user.name || 'Nenhum motorista alocado'}</p>
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-4 border border-indigo-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 uppercase font-bold">Empresa</p>
              <p className="text-sm font-bold text-indigo-900">{vehicle.company?.user.name || 'Nenhum motorista alocado'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-700">Fechar Detalhes</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoModal;