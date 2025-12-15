import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';

const HorseDropdown = ({ items, loading, onScrollEnd, onSelect }) => {
  const [internalFilter, setInternalFilter] = useState('');
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      onScrollEnd();
    }
  };

  // Filter items based on the input inside the dropdown
  const filteredItems = items.filter(item => 
    item.name?.toLowerCase().includes(internalFilter.toLowerCase())
  );

  return (
    <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-lg shadow-2xl z-[100] border border-gray-300 overflow-hidden flex flex-col max-h-80">
      {/* Internal Search Filter */}
      <div className="p-2 bg-gray-50 border-b border-gray-200 sticky top-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick filter list..."
            className="w-full p-2 pl-8 text-sm bg-white border border-gray-300 rounded text-gray-800 outline-none focus:border-red-500"
            value={internalFilter}
            onChange={(e) => setInternalFilter(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((horse, idx) => (
            <div 
              key={`${horse.id}-${idx}`}
              className="p-3 text-gray-800 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 text-left transition-colors"
              onClick={() => onSelect(horse.name)}
            >
              <div className="font-bold uppercase text-xs text-gray-900">{horse.name}</div>
              <div className="text-[10px] text-gray-500 italic">Sire: {horse.sire || 'Unknown'}</div>
            </div>
          ))
        ) : (
          !loading && <div className="p-4 text-center text-gray-400 text-sm">No matches found</div>
        )}
        
        {loading && (
          <div className="p-4 text-center text-xs text-gray-500 animate-pulse font-medium">
            Fetching more horses...
          </div>
        )}
      </div>
    </div>
  );
};

export default HorseDropdown;