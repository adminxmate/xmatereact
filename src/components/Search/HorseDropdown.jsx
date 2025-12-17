import React, { useRef } from 'react';
import { Search } from 'lucide-react';

const HorseDropdown = ({
  items,          // Full list of horses from parent (pre-fetched or paginated)
  loading,        // Loading state from parent
  onScrollEnd,    // Callback to load more when scrolling to bottom
  onSelect,       // Callback when user selects a horse
  searchText = '', // External search text from parent input
}) => {
  const scrollRef = useRef(null);

  // Filter items based on searchText coming from outside
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      onScrollEnd(); // Trigger load more (with current search if server-side)
    }
  };

  return (
    <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-lg shadow-2xl z-[100] border border-gray-300 overflow-hidden flex flex-col max-h-96">
      {/* Clean dropdown — no internal input anymore */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-1"
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((horse, idx) => (
            <div
              key={`${horse.id}-${idx}`} // Prefer horse.id for stable key
              className="p-2 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors flex justify-between items-center"
              onClick={() => onSelect(horse.name)}
            >
              <div className="font-semibold text-gray-900">{horse.name}</div>
              <div className="text-xs text-gray-500">
                Year: {horse.foalingDate || 'Unknown'}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchText.trim() ? (
              <>
                <div className="text-lg font-medium">No horses found</div>
                <div className="text-sm mt-2">
                  matching "<strong>{searchText.trim()}</strong>"
                </div>
              </>
            ) : items.length === 0 && loading ? (
              <div className="text-sm">Loading horses...</div>
            ) : (
              <div className="text-sm">No horses available</div>
            )}
          </div>
        )}

        {/* Loading more indicator */}
        {loading && items.length > 0 && (
          <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
            Loading more horses...
          </div>
        )}
      </div>
    </div>
  );
};

export default HorseDropdown;