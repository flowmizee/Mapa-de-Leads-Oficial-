import React from 'react';
import { Lead } from '../types';
import { Download, Building2, MapPin, Phone, Globe, Star } from 'lucide-react';

interface ResultsTableProps {
  leads: Lead[];
  title: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ leads, title }) => {
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Nome', 'Endereço', 'Telefone', 'Website', 'Avaliação', 'Cidade'];
    const rows = leads.map(lead => [
      `"${lead.name}"`,
      `"${lead.address}"`,
      `"${lead.phone}"`,
      `"${lead.website}"`,
      `"${lead.rating}"`,
      `"${lead.city}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.join('\n').split('\n')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mapa_leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (leads.length === 0) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
        <div>
           <h2 className="text-xl font-bold text-brand-900 flex items-center gap-3">
            {title}
            <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200">
              {leads.length} ENCONTRADOS
            </span>
           </h2>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-blue-200 rounded-lg text-sm font-medium text-brand-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-white border border-blue-100 rounded-2xl shadow-lg shadow-blue-100/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-brand-400 uppercase tracking-wider whitespace-nowrap">
                  Estabelecimento
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-brand-400 uppercase tracking-wider whitespace-nowrap">
                  Contato
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-brand-400 uppercase tracking-wider whitespace-nowrap">
                  Endereço
                </th>
                 <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-brand-400 uppercase tracking-wider whitespace-nowrap">
                  Info
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-blue-50/60 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-brand-950 flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-blue-50 rounded text-brand-500 group-hover:bg-white group-hover:text-brand-600 transition-colors">
                           <Building2 className="w-4 h-4" />
                        </div>
                        {lead.name}
                      </div>
                      {lead.website !== 'N/A' && lead.website !== '' && (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:text-brand-700 hover:underline flex items-center gap-1 ml-8">
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                        {lead.phone !== 'N/A' ? (
                             <div className="text-sm font-medium text-brand-800 flex items-center gap-2 bg-blue-50/50 px-2.5 py-1 rounded-lg w-fit border border-blue-100">
                                <Phone className="w-3.5 h-3.5 text-brand-500" />
                                {lead.phone}
                             </div>
                        ) : (
                            <span className="text-xs text-brand-300 italic pl-2">Sem telefone</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col max-w-xs">
                       <div className="text-sm text-brand-800 flex items-start gap-2 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-brand-300 mt-1 flex-shrink-0" />
                          <span className="truncate group-hover:whitespace-normal transition-all" title={lead.address}>{lead.address}</span>
                       </div>
                       <div className="text-[10px] uppercase tracking-wide text-brand-400 ml-5.5 mt-1 font-bold">
                         {lead.city}
                       </div>
                    </div>
                  </td>
                   <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${lead.rating !== 'N/A' ? 'bg-yellow-50 border border-yellow-100' : 'bg-blue-50/50'}`}>
                            <Star className={`w-3.5 h-3.5 ${lead.rating !== 'N/A' ? 'text-yellow-500 fill-yellow-500' : 'text-blue-200'}`} />
                            <span className={`text-sm font-bold ${lead.rating !== 'N/A' ? 'text-yellow-700' : 'text-blue-300'}`}>
                                {lead.rating !== 'N/A' ? lead.rating : '-'}
                            </span>
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};