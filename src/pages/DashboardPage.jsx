import React, { useState } from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HorseDropdown from "../components/Search/HorseDropdown";
import { useAuth } from "../hooks/useAuth"; // ✅ updated reference

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [realHorse, setRealHorse] = useState(null);
  const [sire, setSire] = useState(null);
  const [dam, setDam] = useState(null);

  const [realError, setRealError] = useState("");
  const [hypoError, setHypoError] = useState("");

  const [generation, setGeneration] = useState(3);
  const [comingSoon, setComingSoon] = useState("");

  const handleRealPedigree = () => {
    if (!realHorse?.value) {
      setRealError("Please select a horse.");
      return;
    }

    if (generation === 6) {
      setComingSoon("6 Generation pedigree is COMING SOON");
      return;
    }

    setRealError("");
    navigate(`/realpedigree?horseid=${realHorse.value}&gen=${generation}`);
  };

  const handleHypotheticalPedigree = () => {
    if (!sire?.value || !dam?.value) {
      setHypoError("Please select both sire and dam.");
      return;
    }

    if (generation === 6) {
      setComingSoon("6 Generation pedigree is COMING SOON");
      return;
    }

    setHypoError("");
    navigate(
      `/hypotheticalpedigree?sireid=${sire.value}&damid=${dam.value}&gen=${generation}`
    );
  };

  return (
    <MainLayout>
      <section className="w-full flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Generation Selector */}
        <div className="flex gap-4 mb-6">
          {[3, 4, 5, 6].map((gen) => (
            <button
              key={gen}
              onClick={() => {
                setGeneration(gen);
                setComingSoon("");
              }}
              className={`px-4 py-2 rounded font-bold border transition ${
                generation === gen
                  ? "bg-[#e23e44] text-white"
                  : "bg-[#111111] text-gray-300 hover:bg-[#222]"
              }`}
            >
              Generation {gen}
            </button>
          ))}
        </div>

        {/* Show COMING SOON message */}
        {comingSoon && (
          <p className="text-blue-400 font-bold text-lg">{comingSoon}</p>
        )}

        {/* Real Pedigree Block */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-[2]">
              <HorseDropdown
                value={realHorse}
                onChange={setRealHorse}
                placeholder="Horse Name"
              />
            </div>
            <button
              onClick={handleRealPedigree}
              className="flex-1 bg-[#e23e44] hover:bg-[#c13238] py-3 rounded font-bold flex items-center justify-center gap-2 transition"
            >
              <Play className="fill-white" size={16} /> Real Pedigree
            </button>
          </div>
          {realError && (
            <p className="text-red-500 text-sm mt-2 ml-1">{realError}</p>
          )}
        </div>

        {/* Hypothetical Pedigree Block */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <HorseDropdown
                value={sire}
                onChange={setSire}
                placeholder="Sire Name"
              />
            </div>
            <div className="flex-1">
              <HorseDropdown
                value={dam}
                onChange={setDam}
                placeholder="Dam Name"
              />
            </div>
            <button
              onClick={handleHypotheticalPedigree}
              className="flex-1 bg-[#e23e44] italic hover:bg-[#c13238] py-3 rounded font-bold flex items-center justify-center gap-2 transition"
            >
              <Play className="fill-white" size={16} /> Hypothetical Pedigree
            </button>
          </div>
          {hypoError && (
            <p className="text-red-500 text-sm mt-2 ml-1">{hypoError}</p>
          )}
        </div>

        {/* Optional logout button */}
        {isLoggedIn && (
          <button
            onClick={logout}
            className="mt-6 text-gray-400 border border-gray-600 px-8 py-2 rounded-sm hover:bg-white/5 transition text-sm"
          >
            Logout
          </button>
        )}
      </section>
    </MainLayout>
  );
};

export default DashboardPage;
