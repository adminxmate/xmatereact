import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const HorseDropdown = ({ items, loading, onScrollEnd, onSelect }) => {
  const [internalFilter, setInternalFilter] = useState('');
  const scrollRef = useRef(null);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(internalFilter.toLowerCase().trim())
  );

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      onScrollEnd();
    }
  };

  // Optional: Auto-focus the input when dropdown opens (if needed)
  // You can control this via a prop if desired

  return (
    <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-lg shadow-2xl z-[100] border border-gray-300 overflow-hidden flex flex-col max-h-96">
      {/* Search Input with Live Filter Indicator */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Type to filter horses..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            value={internalFilter}
            onChange={(e) => setInternalFilter(e.target.value)}
            autoFocus
          />
        </div>

        {/* Show current filter value below input for clarity */}
        {internalFilter.trim() && (
          <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
            <span>
              Filtering by: <strong className="text-red-600">"{internalFilter.trim()}"</strong>
            </span>
            <button
              onClick={() => setInternalFilter('')}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-1"
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((horse, idx) => (
            <div
              key={`${horse.id}-${idx}`}
              className="p-2 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors flex items-stretch"
              onClick={() => {
                onSelect(horse.name);
                setInternalFilter(''); // Optional: clear filter after selection
              }}
            >
              <div className="font-semibold text-gray-900">{horse.name}</div>
              <div className="text-xs text-gray-500 mt-1 ms-auto">
                Year: {horse.foalingDate || 'Unknown'}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {internalFilter.trim() ? (
              <>
                <div className="text-lg font-medium">No horses found</div>
                <div className="text-sm mt-2">
                  matching "<strong>{internalFilter.trim()}</strong>"
                </div>
                <button
                  onClick={() => setInternalFilter('')}
                  className="mt-4 text-red-600 hover:underline text-sm font-medium"
                >
                  Clear filter
                </button>
              </>
            ) : (
              <div className="text-sm">Start typing to filter...</div>
            )}
          </div>
        )}

        {/* Loading indicator at bottom */}
        {loading && (
          <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
            Loading more horses...
          </div>
        )}
      </div>
    </div>
  );
};

export default HorseDropdown;