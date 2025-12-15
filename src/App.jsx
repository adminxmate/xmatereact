import React, { useState } from 'react';
import { Search, Play } from 'lucide-react';
import { useInfiniteHorses } from './hooks/useInfiniteHorses';
import HorseDropdown from './components/Search/HorseDropdown';

const App = () => {
  const [horseSearch, setHorseSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, loading, fetchNextPage } = useInfiniteHorses(horseSearch);

  return (
    <div className="min-h-screen bg-[#333538] text-white flex flex-col">
      {/* Header */}
      <nav className="flex justify-between items-center px-10 py-5">
        <div className="text-2xl font-black italic tracking-tighter">X-MATE</div>
        <div className="hidden md:flex space-x-6 text-[13px] font-bold">
          <a href="#" className="text-[#e23e44]">HOME</a>
          <a href="#" className="hover:text-gray-400">PRICING</a>
          <a href="#" className="hover:text-gray-400">SIGNUP</a>
          <a href="#" className="hover:text-gray-400">LOGIN</a>
        </div>
      </nav>

      {/* Hero / Forms */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-10">
        
        {/* Real Pedigree Form */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-[2]">
              <input
                type="text"
                placeholder="Horse Name"
                className="w-full p-3.5 bg-white text-gray-900 rounded focus:ring-2 ring-red-500 outline-none"
                value={horseSearch}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setHorseSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-4 text-gray-400 w-5 h-5" />
              {showDropdown && (
                <HorseDropdown 
                  items={data} 
                  loading={loading} 
                  onScrollEnd={fetchNextPage}
                  onSelect={(name) => {
                    setHorseSearch(name);
                    setShowDropdown(false);
                  }}
                />
              )}
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="flex-[1.5] p-3.5 bg-white text-gray-900 rounded outline-none"
            />
            <button className="flex-[1] bg-[#e23e44] hover:bg-[#c13238] transition-colors py-3.5 rounded font-bold flex items-center justify-center gap-2">
              <Play className="fill-white w-4 h-4" /> Real Pedigree
            </button>
          </div>
        </div>

        {/* Hypothetical Form */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input type="text" placeholder="Sire Name" className="w-full p-3 bg-white text-gray-900 rounded outline-none" />
              <Search className="absolute right-3 top-3.5 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative flex-1">
              <input type="text" placeholder="Dam Name" className="w-full p-3 bg-white text-gray-900 rounded outline-none" />
              <Search className="absolute right-3 top-3.5 text-gray-400 w-4 h-4" />
            </div>
            <input type="email" placeholder="Email Address" className="flex-1 p-3 bg-white text-gray-900 rounded outline-none" />
            <button className="flex-1 bg-[#e23e44] italic hover:bg-[#c13238] py-3 rounded font-bold flex items-center justify-center gap-2">
              <Play className="fill-white w-4 h-4" /> Hypothetical Pedigree
            </button>
          </div>
        </div>

        <button className="text-gray-300 border border-gray-600 px-8 py-2 rounded-sm hover:bg-white/5 transition text-sm">
          Report missing horse test
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] pt-12 pb-6 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 border-t border-gray-800 pt-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center font-black italic text-xl">X</div>
            <p className="mt-2 text-sm font-bold">xmate.com.au</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Help us:</h3>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Home</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Customer Agreement</a>
            </div>
            <div className="flex gap-4">
              <button className="border border-gray-700 px-6 py-1.5 text-xs hover:bg-white/5">More Info</button>
              <button className="border border-gray-700 px-6 py-1.5 text-xs hover:bg-white/5">Contact Us</button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-16 uppercase tracking-widest">
          © Copyright xmate 2025, Designed & Powered by xmate.
        </p>
      </footer>
    </div>
  );
};

export default App;