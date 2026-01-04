import React, { useState } from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HorseDropdown from "../components/Search/HorseDropdown";
import { useSearchAuth } from "../hooks/useSearchAuth"; // <-- use your new hook

const DashboardPage = () => {
  const navigate = useNavigate();

  // Local horse/email state
  const [realHorse, setRealHorse] = useState(null);
  const [sire, setSire] = useState(null);
  const [dam, setDam] = useState(null);

  const [realEmail, setRealEmail] = useState("");
  const [hypoEmail, setHypoEmail] = useState("");

  const [generation, setGeneration] = useState(3);

  /**
   * Hook usage:
   * - Pass isLoggedIn (true since dashboard is protected)
   * - Provide callback for search execution
   */
  const {
    error: realError,
    activeModal: realModal,
    setActiveModal: setRealModal,
    handleSearchAttempt: handleRealSearchAttempt,
  } = useSearchAuth(true, (sanitizedEmail) => {
    navigate(
      `/realpedigree?horseid=${realHorse.value}&email=${encodeURIComponent(
        sanitizedEmail
      )}&gen=${generation}`
    );
  });

  const {
    error: hypoError,
    activeModal: hypoModal,
    setActiveModal: setHypoModal,
    handleSearchAttempt: handleHypoSearchAttempt,
  } = useSearchAuth(true, (sanitizedEmail) => {
    navigate(
      `/hypotheticalpedigree?sireid=${sire.value}&damid=${dam.value}&email=${encodeURIComponent(
        sanitizedEmail
      )}&gen=${generation}`
    );
  });

  const handleRealPedigree = () => {
    if (!realHorse?.value) {
      setRealModal(null);
      return;
    }
    handleRealSearchAttempt(realEmail);
  };

  const handleHypotheticalPedigree = () => {
    if (!sire?.value || !dam?.value) {
      setHypoModal(null);
      return;
    }
    handleHypoSearchAttempt(hypoEmail);
  };

  return (
    <MainLayout>
      <section className="w-full flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Generation Selector */}
        <div className="flex gap-4 mb-6">
          {[3, 4, 5, 6].map((gen) => (
            <button
              key={gen}
              onClick={() => setGeneration(gen)}
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
            <input
              type="email"
              placeholder="Email Address"
              value={realEmail}
              onChange={(e) => {
                setRealEmail(e.target.value);
              }}
              className="flex-[1.5] p-3 bg-white text-black rounded outline-none"
            />
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
            <input
              type="email"
              placeholder="Email Address"
              value={hypoEmail}
              onChange={(e) => {
                setHypoEmail(e.target.value);
              }}
              className="flex-1 p-3 bg-white text-black rounded outline-none"
            />
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
      </section>
    </MainLayout>
  );
};

export default DashboardPage;
