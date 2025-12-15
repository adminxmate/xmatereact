import React, { useRef } from 'react';

const HorseDropdown = ({ items, loading, onScrollEnd, onSelect }) => {
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Trigger when user is within 10px of the bottom
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      onScrollEnd();
    }
  };

  if (items.length === 0 && !loading) return null;

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="absolute top-full left-0 w-full bg-white mt-1 rounded shadow-2xl z-[100] max-h-64 overflow-y-auto border border-gray-300"
    >
      {items.map((horse, idx) => (
        <div 
          key={`${horse.id || idx}`}
          className="p-3 text-gray-800 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 text-left"
          onClick={() => onSelect(horse.name)}
        >
          {horse.name}
        </div>
      ))}
      {loading && (
        <div className="p-4 text-center text-sm text-gray-500 italic">
          Loading more horses...
        </div>
      )}
    </div>
  );
};

// CRITICAL FIX: Ensure this line exists exactly like this
export default HorseDropdown;