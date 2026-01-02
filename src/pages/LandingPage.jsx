import React, { useState } from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HorseDropdown from "../components/Search/HorseDropdown";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // State for Selection
  const [realHorse, setRealHorse] = useState(null);
  const [sire, setSire] = useState(null);
  const [dam, setDam] = useState(null);

  // Split Email States to work separately
  const [realEmail, setRealEmail] = useState("");
  const [hypoEmail, setHypoEmail] = useState("");

  // Error States
  const [realError, setRealError] = useState("");
  const [hypoError, setHypoError] = useState("");

  const validateEmail = (emailToValidate) => {
    const trimmed = emailToValidate.trim();
    if (!trimmed) return { valid: false, message: "Email is required." };

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!regex.test(trimmed)) {
      return { valid: false, message: "Please enter a valid email address." };
    }

    return { valid: true, message: "" };
  };

  const handleRealPedigree = () => {
    if (!realHorse?.value) {
      setRealError("Please select a horse.");
      return;
    }

    // Validate using realEmail specifically
    const { valid, message } = validateEmail(realEmail);
    if (!valid) {
      setRealError(message);
      setHypoError(""); // Clear other error
      return;
    }

    setRealError("");
    navigate(`/realpedigree?horseid=${realHorse.value}&email=${encodeURIComponent(realEmail.trim())}`);
  };

  const handleHypotheticalPedigree = () => {
    if (!sire?.value || !dam?.value) {
      setHypoError("Please select both sire and dam.");
      return;
    }

    // Validate using hypoEmail specifically
    const { valid, message } = validateEmail(hypoEmail);
    if (!valid) {
      setHypoError(message);
      setRealError(""); // Clear other error
      return;
    }

    setHypoError("");
    navigate(
      `/hypotheticalpedigree?sireid=${sire.value}&damid=${dam.value}&email=${encodeURIComponent(hypoEmail.trim())}`
    );
  };

  return (
    <MainLayout>
      <section className="w-full flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Section 1: Real Pedigree */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-[2]">
              <HorseDropdown value={realHorse} onChange={setRealHorse} placeholder="Horse Name" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={realEmail}
              onChange={(e) => {
                setRealEmail(e.target.value);
                setRealError("");
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
          {realError && <p className="text-red-500 text-sm mt-2 ml-1">{realError}</p>}
        </div>

        {/* Section 2: Hypothetical Pedigree */}
        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <HorseDropdown value={sire} onChange={setSire} placeholder="Sire Name" />
            </div>
            <div className="flex-1">
              <HorseDropdown value={dam} onChange={setDam} placeholder="Dam Name" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={hypoEmail}
              onChange={(e) => {
                setHypoEmail(e.target.value);
                setHypoError("");
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
          {hypoError && <p className="text-red-500 text-sm mt-2 ml-1">{hypoError}</p>}
        </div>

        <button
          onClick={() => navigate("/horses")}
          className="text-gray-400 border border-gray-600 px-8 py-2 rounded-sm hover:bg-white/5 transition text-sm"
        >
          Report missing horse test
        </button>
      </section>
    </MainLayout>
  );
};

export default LandingPage;