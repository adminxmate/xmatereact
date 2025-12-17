// src/page/HypotheticalPedigreePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

const HypotheticalPedigreePage = () => {
  const [searchParams] = useSearchParams();

  // Get sireid and damid from query params (required for hypothetical)
  const sireId = searchParams.get("sireid") || "497875";
  const damId = searchParams.get("damid") || "376952";
  const gen = Math.min(parseInt(searchParams.get("gen")) || 4, 6); // Default to 4, cap at 6

  const [pedigree, setPedigree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedigree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://haves.co.in/api/v1/horses/hypo?sireid=${sireId}&damid=${damId}&gen=${gen}`
        );
        setPedigree(response.data);
      } catch (err) {
        console.error("Hypothetical pedigree fetch error:", err);
        const msg = err.response?.data?.error || err.message || "Unknown error";
        setError(`Failed to load hypothetical pedigree: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPedigree();
  }, [sireId, damId, gen]);

  return (
    <MainLayout>
      <main className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Hypothetical Pedigree</h1>
            <p className="text-xl text-gray-400">
              Sire ID: <span className="text-white">{sireId}</span> × Dam ID: <span className="text-white">{damId}</span>
            </p>
            <p className="text-lg text-gray-500 mt-2">Generation {gen}</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-2xl text-yellow-400">Loading hypothetical pedigree...</div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center bg-red-900/50 border-2 border-red-600 rounded-xl p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-xl">{error}</p>
            </div>
          )}

          {/* Raw JSON Debug (optional - remove in production) */}
          {!loading && pedigree && (
            <div className="mb-12 text-xs">
              <details className="bg-gray-900/50 rounded-lg p-4">
                <summary className="cursor-pointer text-lg font-semibold mb-2">View Raw API Response</summary>
                <pre className="overflow-x-auto text-xs">{JSON.stringify(pedigree, null, 2)}</pre>
              </details>
            </div>
          )}

          {/* Nested Pedigree Display */}
          {!loading && !error && pedigree && pedigree.gen2 && (
            <div className="flex justify-center overflow-x-auto">
              <div className="flex flex-col items-center">

                {/* Generation 2 - Parents */}
                <div className="flex gap-32 mb-16">
                  {/* Sire */}
                  <div className="flex flex-col items-center">
                    <div className="w-80 bg-gray-900/80 border-2 border-gray-500 rounded-xl p-8 text-center shadow-2xl">
                      <div className="text-2xl font-bold">{pedigree.gen2.sire?.name || "Unknown Sire"}</div>
                      {pedigree.gen2.sire?.country && <div className="text-lg uppercase text-gray-400 mt-2">{pedigree.gen2.sire.country}</div>}
                      {pedigree.gen2.sire?.yob && <div className="text-gray-500">{pedigree.gen2.sire.yob}</div>}
                    </div>
                  </div>

                  {/* Dam */}
                  <div className="flex flex-col items-center">
                    <div className="w-80 bg-pink-900/30 border-2 border-pink-700 rounded-xl p-8 text-center shadow-2xl">
                      <div className="text-2xl font-bold">{pedigree.gen2.dam?.name || "Unknown Dam"}</div>
                      {pedigree.gen2.dam?.country && <div className="text-lg uppercase text-gray-400 mt-2">{pedigree.gen2.dam.country}</div>}
                      {pedigree.gen2.dam?.yob && <div className="text-gray-500">{pedigree.gen2.dam.yob}</div>}
                    </div>
                  </div>
                </div>

                {/* Generation 3 */}
                {gen >= 3 && pedigree.gen3 && (
                  <div className="flex gap-12 mb-12">
                    {["sire.sire", "sire.dam", "dam.sire", "dam.dam"].map((path, i) => {
                      const parts = path.split(".");
                      const branch = parts.reduce((o, k) => o?.[k], pedigree.gen3);
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-64 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-6 text-center">
                            <div className="font-bold text-lg">{branch?.sire?.name || "—"}</div>
                            {branch?.sire?.country && <div className="text-sm uppercase text-gray-400 mt-1">{branch.sire.country}</div>}
                          </div>
                          <div className="h-12 w-0.5 bg-gray-600 my-4"></div>
                          <div className="w-64 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-6 text-center">
                            <div className="font-bold text-lg">{branch?.dam?.name || "—"}</div>
                            {branch?.dam?.country && <div className="text-sm uppercase text-gray-400 mt-1">{branch.dam.country}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Generation 4 */}
                {gen >= 4 && pedigree.gen4 && (
                  <div className="flex gap-8 mb-12">
                    {["sire.sire", "sire.dam", "dam.sire", "dam.dam"].flatMap((parentPath) =>
                      ["sire", "dam"].map((side) => `${parentPath}.${side}`)
                    ).map((fullPath, i) => {
                      const parts = fullPath.split(".");
                      const branch = parts.reduce((o, k) => o?.[k], pedigree.gen4);
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-56 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-5 text-center text-sm">
                            <div className="font-semibold">{branch?.sire?.name || "—"}</div>
                            {branch?.sire?.country && <div className="text-xs uppercase text-gray-400">{branch.sire.country}</div>}
                          </div>
                          <div className="h-10 w-0.5 bg-gray-600 my-3"></div>
                          <div className="w-56 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-5 text-center text-sm">
                            <div className="font-semibold">{branch?.dam?.name || "—"}</div>
                            {branch?.dam?.country && <div className="text-xs uppercase text-gray-400">{branch.dam.country}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add gen5 & gen6 similarly if needed */}

              </div>
            </div>
          )}

          {/* Fallback if no pedigree data */}
          {!loading && !error && pedigree && !pedigree.gen2 && (
            <div className="text-center text-gray-400 text-xl">
              No pedigree data available for the selected generation.
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default HypotheticalPedigreePage;