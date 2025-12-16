import React, { useState } from "react";
import { Search, Play, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { useInfiniteHorses } from "../hooks/useInfiniteHorses";
import HorseDropdown from "../components/Search/HorseDropdown";

const LandingPage = () => {
  const [realQuery, setRealQuery] = useState("");
  const [showRealDrop, setShowRealDrop] = useState(false);
  const { items, loading, fetchNextPage } = useInfiniteHorses(realQuery);
  const navigate = useNavigate();

  return (
    <MainLayout>
      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        {/* Real Pedigree Form */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-[2]">
              <input
                type="text"
                placeholder="Horse Name"
                className="w-full p-3.5 bg-white text-black rounded outline-none"
                value={realQuery}
                onFocus={() => setShowRealDrop(true)}
                onChange={(e) => setRealQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-4 text-gray-400" size={20} />
              {showRealDrop && (
                <HorseDropdown
                  items={items}
                  loading={loading}
                  onScrollEnd={fetchNextPage}
                  onSelect={(val) => {
                    setRealQuery(val);
                    setShowRealDrop(false);
                  }}
                />
              )}
            </div>
            <input type="email" placeholder="Email Address" className="flex-[1.5] p-3.5 bg-white text-black rounded outline-none" />
            <button className="flex-1 bg-[#e23e44] hover:bg-[#c13238] py-3.5 rounded font-bold flex items-center justify-center gap-2 transition">
              <Play className="fill-white" size={16} /> Real Pedigree
            </button>
          </div>
        </div>

        {/* Hypothetical Pedigree Form */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input type="text" placeholder="Sire Name" className="w-full p-3.5 bg-white text-black rounded outline-none" />
              <Search className="absolute right-3 top-4 text-gray-400" size={18} />
            </div>
            <div className="relative flex-1">
              <input type="text" placeholder="Dam Name" className="w-full p-3.5 bg-white text-black rounded outline-none" />
              <Search className="absolute right-3 top-4 text-gray-400" size={18} />
            </div>
            <input type="email" placeholder="Email Address" className="flex-1 p-3.5 bg-white text-black rounded outline-none" />
            <button className="flex-1 bg-[#e23e44] italic hover:bg-[#c13238] py-3.5 rounded font-bold flex items-center justify-center gap-2 transition">
              <Play className="fill-white" size={16} /> Hypothetical Pedigree
            </button>
          </div>
        </div>

        <button onClick={() => navigate("/horses")} className="text-gray-400 border border-gray-600 px-8 py-2 rounded-sm hover:bg-white/5 transition text-sm">
          Report missing horse test
        </button>
      </main>
    </MainLayout>
  );
};

export default LandingPage;
