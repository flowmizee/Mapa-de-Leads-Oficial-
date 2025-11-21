import React, { useState } from 'react';
import { SearchMode, SearchParams } from '../types';
import { Search, Map, List, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isSearching }) => {
  const [mode, setMode] = useState<SearchMode>(SearchMode.SINGLE);
  const [segment, setSegment] = useState('');
  const [singleCity, setSingleCity] = useState('');
  const [multiCities, setMultiCities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      segment,
      mode,
      singleCity,
      multiCities
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-blue-100 border border-blue-50 overflow-hidden">
      <div className="p-6 border-b border-blue-50 bg-gradient-to-r from-white to-blue-50/30">
        <h2 className="text-lg font-bold text-brand-900 mb-1">Nova Pesquisa</h2>
        <p className="text-brand-600/80 text-sm">Defina os parâmetros para extração.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Segment Input */}
        <div>
          <label htmlFor="segment" className="block text-sm font-semibold text-brand-900 mb-2">
            Segmento / Nicho
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-brand-300 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              id="segment"
              required
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 sm:text-sm transition-all text-brand-900 placeholder-brand-300"
              placeholder="Ex: Lanchonetes, Farmácias..."
            />
          </div>
        </div>

        {/* Mode Toggle */}
        <div>
           <label className="block text-sm font-semibold text-brand-900 mb-3">
            Abrangência
          </label>
          <div className="flex p-1.5 bg-blue-50 rounded-xl w-full border border-blue-100">
            <button
              type="button"
              onClick={() => setMode(SearchMode.SINGLE)}
              className={`flex-1 flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === SearchMode.SINGLE
                  ? 'bg-white text-brand-700 shadow-md shadow-blue-100 ring-1 ring-black/5'
                  : 'text-brand-400 hover:text-brand-600 hover:bg-blue-100/50'
              }`}
            >
              <Map className="w-4 h-4" />
              Cidade Única
            </button>
            <button
              type="button"
              onClick={() => setMode(SearchMode.MULTI)}
              className={`flex-1 flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === SearchMode.MULTI
                  ? 'bg-white text-brand-700 shadow-md shadow-blue-100 ring-1 ring-black/5'
                  : 'text-brand-400 hover:text-brand-600 hover:bg-blue-100/50'
              }`}
            >
              <List className="w-4 h-4" />
              Multi-Cidades
            </button>
          </div>
        </div>

        {/* Location Inputs */}
        <div className="transition-all duration-300 ease-in-out">
          {mode === SearchMode.SINGLE ? (
            <div className="animate-fadeIn">
              <label htmlFor="singleCity" className="block text-sm font-semibold text-brand-900 mb-2">
                Localização
              </label>
              <input
                type="text"
                id="singleCity"
                required={mode === SearchMode.SINGLE}
                value={singleCity}
                onChange={(e) => setSingleCity(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 sm:text-sm transition-all text-brand-900 placeholder-brand-300"
                placeholder="Ex: Paulo Ramos - MA"
              />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <label htmlFor="multiCities" className="block text-sm font-semibold text-brand-900 mb-2">
                Lista de Cidades
              </label>
              <textarea
                id="multiCities"
                rows={5}
                required={mode === SearchMode.MULTI}
                value={multiCities}
                onChange={(e) => setMultiCities(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 sm:text-sm font-mono text-brand-900 placeholder-brand-300 resize-none"
                placeholder={'Paulo Ramos - MA\nTeresina - PI\nSão Luís - MA'}
              />
              <p className="mt-2 text-xs text-brand-500 font-medium">
                Uma cidade por linha.
              </p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSearching}
            className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-[0.98] ${
              isSearching ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Iniciar Extração
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};