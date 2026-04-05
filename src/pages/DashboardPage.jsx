import React, { useState, useEffect } from "react";
import { Play, AlertTriangle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HorseDropdown from "../components/Search/HorseDropdown";
import { useAuth } from "../hooks/useAuth";
import { resendVerification } from "../services/authService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { 
    isLoggedIn, 
    user,
    profile,
    role,
    logout, 
    needs_verification_warning, 
    is_suspended, 
    is_verified, 
    refreshUser 
  } = useAuth();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const [realHorse, setRealHorse] = useState(null);
  const [sire, setSire] = useState(null);
  const [dam, setDam] = useState(null);

  const [realError, setRealError] = useState("");
  const [hypoError, setHypoError] = useState("");

  const generation = 3;

  // Auto-refresh when coming back to the tab
  useEffect(() => {
    if (isLoggedIn && !is_verified) {
      const handleFocus = () => refreshUser();
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [isLoggedIn, is_verified, refreshUser]);

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    const result = await resendVerification();
    setResendMessage(result.message);
    setResendLoading(false);
    // After resending, re-check status
    refreshUser();
    // Clear message after 5 seconds
    setTimeout(() => setResendMessage(""), 5000);
  };

  const handleRealPedigree = () => {
    if (is_suspended) return;
    if (!realHorse?.value) {
      setRealError("Please select a horse.");
      return;
    }

    setRealError("");
    navigate(`/realpedigree?horseid=${realHorse.value}&gen=${generation}`);
  };

  const handleHypotheticalPedigree = () => {
    if (is_suspended) return;
    if (!sire?.value || !dam?.value) {
      setHypoError("Please select both sire and dam.");
      return;
    }

    setHypoError("");
    navigate(
      `/hypotheticalpedigree?sireid=${sire.value}&damid=${dam.value}&gen=${generation}`
    );
  };

  return (
    <MainLayout>
      <section className="w-full flex-grow flex flex-col items-center justify-start p-6 space-y-6">
        
        {/* Verification Warning Banner */}
        {needs_verification_warning && (
          <div className="w-full max-w-5xl bg-amber-50 border border-amber-200 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-grow">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
              <p className="text-amber-800 text-sm font-medium">
                Please verify your email before 14 days else your account will be suspended.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              {resendMessage && (
                <span className="text-xs text-amber-700 bg-amber-100/50 px-2 py-1 rounded">
                  {resendMessage}
                </span>
              )}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Re-verify Now"}
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase italic tracking-wider flex items-center gap-2">
              Hi, {profile?.username || profile?.display_name || user?.displayName || "User"} 
              {role && (
                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full not-italic tracking-normal">
                  {role}
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Suspension Banner */}
        {is_suspended && (
          <div className="w-full max-w-5xl bg-red-50 border border-red-200 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-grow">
              <ShieldAlert className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm font-medium">
                Your account has been suspended due to lack of email verification. Please verify your email to restore access.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              {resendMessage && (
                <span className="text-xs text-red-700 bg-red-100/50 px-2 py-1 rounded">
                  {resendMessage}
                </span>
              )}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded transition disabled:opacity-50 whitespace-nowrap"
              >
                {resendLoading ? "Sending..." : "Re-verify & Restore"}
              </button>
            </div>
          </div>
        )}

        {/* Real Pedigree Block */}
        <div className={`w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black ${is_suspended ? 'opacity-50 pointer-events-none' : ''}`}>
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
              disabled={is_suspended}
              className="flex-1 bg-[#e23e44] hover:bg-[#c13238] py-3 rounded font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Play className="fill-white" size={16} /> Real Pedigree
            </button>
          </div>
          {realError && (
            <p className="text-red-500 text-sm mt-2 ml-1">{realError}</p>
          )}
        </div>

        {/* Hypothetical Pedigree Block */}
        <div className={`w-full max-w-5xl bg-[#111111] p-6 rounded shadow-2xl border border-black ${is_suspended ? 'opacity-50 pointer-events-none' : ''}`}>
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
              disabled={is_suspended}
              className="flex-1 bg-[#e23e44] italic hover:bg-[#c13238] py-3 rounded font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Play className="fill-white" size={16} /> Hypothetical Pedigree
            </button>
          </div>
          {hypoError && (
            <p className="text-red-500 text-sm mt-2 ml-1">{hypoError}</p>
          )}
        </div>

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
