import React, { useState, useEffect } from 'react';
import { getDetailedHorses } from '../api/horseApi';
import { Pencil, Trash2, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

const HorseDataTable = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for all filters
  const [filters, setFilters] = useState({ name: '', sire: '', dam: '', date: '', damsire: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Fetches based on primary Name search and Page
      const res = await getDetailedHorses({ page, search: filters.name });
      setHorses(res.data);
      setTotalPages(res.lastPage);
      setLoading(false);
    };
    load();
  }, [page, filters.name]);

  // Client-side filtering for secondary fields (Sire/Dam/DamSire)
  const filteredData = horses.filter(h => 
    (h.sire?.toLowerCase().includes(filters.sire.toLowerCase()) || !filters.sire) &&
    (h.dam?.toLowerCase().includes(filters.dam.toLowerCase()) || !filters.dam) &&
    (h.damsire?.toLowerCase().includes(filters.damsire.toLowerCase()) || !filters.damsire) &&
    (h.foaling_date?.includes(filters.date) || !filters.date)
  );

  return (
    <div className="min-h-screen bg-[#333538] text-white p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition">
          <ArrowLeft size={18} /> Back to Search
        </button>

        <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-8">Registry Management</h1>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-black/20 p-4 rounded border border-gray-800">
          <input className="bg-[#111] border border-gray-700 p-2 rounded text-sm outline-none focus:border-[#e23e44]" placeholder="Name Search..." value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
          <input className="bg-[#111] border border-gray-700 p-2 rounded text-sm outline-none focus:border-[#e23e44]" placeholder="Filter Sire..." value={filters.sire} onChange={e => setFilters({...filters, sire: e.target.value})} />
          <input className="bg-[#111] border border-gray-700 p-2 rounded text-sm outline-none focus:border-[#e23e44]" placeholder="Filter Dam..." value={filters.dam} onChange={e => setFilters({...filters, dam: e.target.value})} />
          <input className="bg-[#111] border border-gray-700 p-2 rounded text-sm outline-none focus:border-[#e23e44]" placeholder="Dam Sire..." value={filters.damsire} onChange={e => setFilters({...filters, damsire: e.target.value})} />
          <input type="date" className="bg-[#111] border border-gray-700 p-2 rounded text-sm outline-none text-gray-400" onChange={e => setFilters({...filters, date: e.target.value})} />
        </div>

        {/* Table Area */}
        <div className="bg-[#111] rounded border border-black overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-800">
                <tr>
                  <th className="p-4">Horse Name</th>
                  <th className="p-4">Foaling Date</th>
                  <th className="p-4">Sire</th>
                  <th className="p-4">Dam</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#e23e44]" /></td></tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map(horse => (
                    <tr key={horse.id} className="hover:bg-white/5 transition border-b border-gray-900">
                      <td className="p-4 font-bold text-gray-200 uppercase text-xs">{horse.name}</td>
                      <td className="p-4 text-gray-500 text-xs">{formatDate(horse.foalingDate) || 'N/A'}</td>
                      <td className="p-4 text-gray-400 text-xs italic">{horse.sireName || '---'}</td>
                      <td className="p-4 text-gray-400 text-xs italic">{horse.damName || '---'}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3 text-gray-500">
                          <button className="hover:text-blue-400 transition"><Pencil size={16} /></button>
                          <button className="hover:text-[#e23e44] transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="p-16 text-center text-gray-600 italic">No horses found. Try adjusting your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation */}
          <div className="bg-black/60 p-4 flex justify-between items-center text-[11px] font-bold uppercase text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-gray-800 rounded-sm hover:bg-white/5 disabled:opacity-10 transition">
                <ChevronLeft size={14} className="inline mr-1"/> Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-gray-800 rounded-sm hover:bg-white/5 disabled:opacity-10 transition">
                Next <ChevronRight size={14} className="inline ml-1"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorseDataTable;