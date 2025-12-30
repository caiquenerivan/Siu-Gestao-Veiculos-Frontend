import React from 'react';
import { Car, MapPin, Calendar } from 'lucide-react';

export function DriverDashboard() {
  return (
    <div className="space-y-6">
      {/* Card do Veículo Atual */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-sm mb-1">Veículo Atual</p>
            <h2 className="text-3xl font-bold">Fiat Fiorino</h2>
            <p className="text-xl text-slate-300 mt-1">ABC-1234</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <Car size={32} className="text-white" />
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-700 flex gap-8">
          <div>
            <p className="text-slate-400 text-xs">Retirada</p>
            <p className="font-semibold flex items-center gap-1">
              <Calendar size={14} /> 12/05 - 08:00
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Status</p>
            <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
              Em Rota
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Minhas Últimas Viagens</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Entrega Zona Sul</p>
                <p className="text-xs text-gray-500">10/05/2024</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">Concluída</span>
          </li>
          {/* Mais itens podem vir aqui */}
        </ul>
      </div>
    </div>
  );
}