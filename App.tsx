import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsTable } from './components/ResultsTable';
import { SearchParams, Lead, SearchMode } from './types';
import { fetchLeadsForCity } from './services/geminiService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>('');

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsSearching(true);
    setError(null);
    setLeads([]);
    setSearchStatus('Iniciando varredura...');

    try {
      let citiesToSearch: string[] = [];

      if (params.mode === SearchMode.SINGLE) {
        if (!params.singleCity.trim()) throw new Error("Por favor, informe uma cidade.");
        citiesToSearch = [params.singleCity];
      } else {
        citiesToSearch = params.multiCities
          .split('\n')
          .map(c => c.trim())
          .filter(c => c.length > 0);
        
        if (citiesToSearch.length === 0) throw new Error("Por favor, informe pelo menos uma cidade.");
      }

      let allLeads: Lead[] = [];

      for (let i = 0; i < citiesToSearch.length; i++) {
        const city = citiesToSearch[i];
        setSearchStatus(`Mapeando ${params.segment} em ${city} (${i + 1}/${citiesToSearch.length})...`);
        
        const cityLeads = await fetchLeadsForCity(params.segment, city);
        allLeads = [...allLeads, ...cityLeads];
        
        setLeads(prev => [...prev, ...cityLeads]);
      }

      if (allLeads.length === 0) {
        setError("Nenhum estabelecimento encontrado com os critérios informados. Tente usar termos mais genéricos (ex: 'Lanchonete' em vez de 'Lanchonete do João').");
      } else {
        setSearchStatus(`Concluído! Encontrados ${allLeads.length} resultados.`);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao buscar os dados. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans text-brand-950">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Search Form */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-28 space-y-4">
                <SearchForm onSearch={handleSearch} isSearching={isSearching} />
                
                {isSearching && (
                  <div className="p-4 bg-white border border-brand-100 rounded-xl shadow-sm flex items-center gap-3 animate-fadeIn">
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                    <p className="text-sm text-brand-700 font-medium">
                      {searchStatus}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 shadow-sm animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                 {!isSearching && !error && leads.length > 0 && (
                   <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 shadow-sm animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 font-medium">Extração finalizada com sucesso.</p>
                  </div>
                 )}
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 xl:col-span-9">
              {leads.length > 0 ? (
                <ResultsTable leads={leads} title="Leads Extraídos" />
              ) : (
                !isSearching && !error && (
                  <div className="h-[500px] border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center text-center bg-white/50 p-8">
                    <SearchFormIconPlaceholder />
                    <h3 className="text-xl font-bold text-brand-900 mt-6">Pronto para Extrair</h3>
                    <p className="text-brand-500 max-w-md mt-2">
                      Configure a pesquisa para iniciar a varredura em tempo real no Google Maps.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-blue-100 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-brand-300 text-sm font-medium">
          &copy; {new Date().getFullYear()} Mapa de Leads.
        </div>
      </footer>
    </div>
  );
}

// Blue styled placeholder
const SearchFormIconPlaceholder = () => (
  <div className="relative">
     <div className="absolute inset-0 bg-brand-200 rounded-full opacity-20 animate-pulse blur-xl"></div>
     <svg className="w-32 h-32 text-brand-100 relative z-10" fill="currentColor" viewBox="0 0 24 24">
       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
       <circle cx="12" cy="9" r="2.5" />
     </svg>
  </div>
);

export default App;