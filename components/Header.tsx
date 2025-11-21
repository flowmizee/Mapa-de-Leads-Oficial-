import React from 'react';
import { MapPin, Search, Database } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg shadow-brand-200">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-950 tracking-tight">Mapa de Leads</h1>
              <p className="text-xs text-brand-600 font-medium uppercase tracking-wider">Extrator Inteligente</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 text-brand-800/70">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Busca Profunda</span>
            </div>
            <div className="flex items-center gap-2 text-brand-800/70">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Dados Atualizados</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};