import React, { useState, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { Loader2 } from "lucide-react";
import { getCurrencySymbol, convertCurrency } from "../utils/currency";
import { convertPrice } from "../utils/annualprice";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Default: USD + monthly
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://haves.co.in/api/v1/plans");
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // ✅ Since API returns single plan, just take first
  const displayedPlan = plans[0];

  return (
    <MainLayout>
      <div className="min-h-screen text-white p-6 md:p-12 font-sans flex items-center justify-center">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-[#e23e44]" size={40} />
        ) : displayedPlan ? (
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-extrabold mb-4">Choose Your Plan</h1>
            <p className="text-gray-400 font-black mb-8">Get extra 10% discount on yearly plan</p>

            {/* Global Toggles */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
              {/* Tenure Toggle */}
              <div className="bg-gray-800 rounded-full p-1 flex">
                {["monthly", "yearly"].map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-6 py-2 rounded-full transition ${billingCycle === cycle ? "bg-[#e23e44] text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                  </button>
                ))}
              </div>

              {/* Currency Toggle */}
              <div className="bg-gray-800 rounded-full p-1 flex">
                {["INR", "USD", "EUR"].map((cur) => (
                  <button key={cur} onClick={() => setCurrency(cur)} className={`px-6 py-2 rounded-full transition ${currency === cur ? "bg-[#e23e44] text-white" : "text-gray-400 hover:text-white"}`}>
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Single Plan Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 p-8 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2">{displayedPlan.name}</h2>
              <p className="text-gray-400 mb-6">{displayedPlan.overview}</p>
              <div className="text-5xl font-extrabold text-[#e23e44] mb-6">
                {`${getCurrencySymbol(currency)}${convertCurrency(
                  convertPrice(displayedPlan.price, billingCycle),
                  currency
                )}`}
                <span className="text-sm text-gray-400 ml-1">/{billingCycle}</span>
              </div>

              <ul className="text-sm text-gray-300 mb-6 space-y-2 text-left w-full">
                {displayedPlan.features?.split(",").map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#e23e44]">✔</span> {f.trim()}
                  </li>
                ))}
              </ul>
              <button className="mt-auto bg-[#e23e44] hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition">Get Started</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No plan available</p>
        )}
      </div>
    </MainLayout>
  );
};

export default PlansPage;
