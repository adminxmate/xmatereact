import React, { useState } from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HorseDropdown from "../components/search/HorseDropdown";

const LandingPage = () => {
  const navigate = useNavigate();

  const [realHorse, setRealHorse] = useState("");
  const [sire, setSire] = useState("");
  const [dam, setDam] = useState("");

  return (
    <MainLayout>
      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-[2]">
              <HorseDropdown value={realHorse} onChange={setRealHorse} placeholder="Horse Name" />
            </div>
            <input type="email" placeholder="Email Address" className="flex-[1.5] p-3.5 bg-white text-black rounded outline-none" />
            <button className="flex-1 bg-[#e23e44] hover:bg-[#c13238] py-3.5 rounded font-bold flex items-center justify-center gap-2 transition">
              <Play className="fill-white" size={16} /> Real Pedigree
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <HorseDropdown value={sire} onChange={setSire} placeholder="Sire Name" />
            </div>

            <div className="flex-1">
              <HorseDropdown value={dam} onChange={setDam} placeholder="Dam Name" />
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
