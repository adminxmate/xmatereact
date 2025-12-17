import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

const RealPedigreePage = () => {
  const [searchParams] = useSearchParams();

  const horseId = searchParams.get("horseid") || "528492";
  const gen = parseInt(searchParams.get("gen")) || 5;

  const [pedigree, setPedigree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedigree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://haves.co.in/api/v1/horses/real?horseid=${horseId}&gen=${gen}`);
        setPedigree(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        let errMsg = "Failed to load data.";
        if (err.response?.data?.error) {
          errMsg = err.response.data.error;
        } else if (err.message) {
          errMsg += ` ${err.message}`;
        }
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchPedigree();
  }, [horseId, gen]);

  // Recursively loop through all generations and collect horses
  const collectAllHorses = (data) => {
    const horses = [];

    const recurse = (obj, generation = null) => {
      if (!obj || typeof obj !== "object") return;

      if (obj.name) {
        // This is a horse object
        horses.push({
          generation,
          name: obj.name || "Unknown",
          country: obj.country || "-",
          yob: obj.yob || "-",
        });
      }

      // Recurse into any nested objects (sire, dam, or gen keys)
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object") {
          const genLabel = generation ? `${generation} → ${key}` : key;
          recurse(obj[key], genLabel);
        }
      });
    };

    // Start with main horse
    if (data.horse) {
      horses.push({
        generation: "Main Horse",
        name: data.horse.name || "Unknown",
        country: data.horse.country || "-",
        yob: data.horse.yob || "-",
      });
    }

    recurse(data);

    return horses;
  };

  const allHorses = pedigree ? collectAllHorses(pedigree) : [];

  return (
    <MainLayout>
      <main className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Pedigree Data Dump (Horse ID: {horseId}, Gen: {gen})
          </h1>

          {/* Loading */}
          {loading && <div className="text-center text-xl text-yellow-400">Loading data from API...</div>}

          {/* Error */}
          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-lg">{error}</p>
              <p className="text-sm text-gray-300 mt-4">Common fix: Ensure the backend API is running and accepts these parameters.</p>
            </div>
          )}

          {/* Raw JSON Preview */}
          {!loading && pedigree && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Raw API Response (JSON)</h2>
              <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm">{JSON.stringify(pedigree, null, 2)}</pre>
            </div>
          )}

          {/* All Extracted Horses */}
          {!loading && !error && allHorses.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">All Horses Found in Response ({allHorses.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-4 py-3 text-left">Generation/Path</th>
                      <th className="border border-gray-700 px-4 py-3 text-left">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHorses.map((horse, index) => (
                      <tr key={index} className="hover:bg-gray-900/50 transition">
                        <td className="border border-gray-700 px-4 py-3 text-gray-400 text-sm">{horse.generation || "Unknown"}</td>
                        <td className="border border-gray-700 px-4 py-3 font-medium">{horse.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {pedigree && pedigree.gen2 && (
            <div className="flex justify-center mt-16">
              <div className="flex flex-col items-center">
                {/* Generation 2 (Parents) */}
                <div className="flex gap-32 mb-12">
                  {/* Sire */}
                  <div className="flex flex-col items-center">
                    <div className="w-72 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-6 text-center shadow-xl">
                      <div className="font-bold text-white text-xl">{pedigree.gen2.sire?.name || "Unknown Sire"}</div>
                      {pedigree.gen2.sire?.country && <div className="text-sm uppercase text-gray-400 mt-2">{pedigree.gen2.sire.country}</div>}
                      {pedigree.gen2.sire?.yob && <div className="text-sm text-gray-500">{pedigree.gen2.sire.yob}</div>}
                    </div>
                  </div>

                  {/* Dam */}
                  <div className="flex flex-col items-center">
                    <div className="w-72 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-6 text-center shadow-xl">
                      <div className="font-bold text-white text-xl">{pedigree.gen2.dam?.name || "Unknown Dam"}</div>
                      {pedigree.gen2.dam?.country && <div className="text-sm uppercase text-gray-400 mt-2">{pedigree.gen2.dam.country}</div>}
                      {pedigree.gen2.dam?.yob && <div className="text-sm text-gray-500">{pedigree.gen2.dam.yob}</div>}
                    </div>
                  </div>
                </div>

                {/* Generation 3 */}
                {gen >= 3 && pedigree.gen3 && (
                  <div className="flex gap-12 mb-12">
                    {/* Sire's Parents */}
                    <div className="flex gap-12">
                      <div className="flex flex-col items-center">
                        <div className="w-60 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-5 text-center">
                          <div className="font-semibold text-white">{pedigree.gen3.sire?.sire?.name || "—"}</div>
                          {pedigree.gen3.sire?.sire?.country && <div className="text-xs uppercase text-gray-400 mt-1">{pedigree.gen3.sire.sire.country}</div>}
                        </div>
                        <div className="h-10 w-0.5 bg-gray-600 my-3"></div>
                        <div className="w-60 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-5 text-center">
                          <div className="font-semibold text-white">{pedigree.gen3.sire?.dam?.name || "—"}</div>
                          {pedigree.gen3.sire?.dam?.country && <div className="text-xs uppercase text-gray-400 mt-1">{pedigree.gen3.sire.dam.country}</div>}
                        </div>
                      </div>

                      {/* Dam's Parents */}
                      <div className="flex flex-col items-center">
                        <div className="w-60 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-5 text-center">
                          <div className="font-semibold text-white">{pedigree.gen3.dam?.sire?.name || "—"}</div>
                          {pedigree.gen3.dam?.sire?.country && <div className="text-xs uppercase text-gray-400 mt-1">{pedigree.gen3.dam.sire.country}</div>}
                        </div>
                        <div className="h-10 w-0.5 bg-gray-600 my-3"></div>
                        <div className="w-60 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-5 text-center">
                          <div className="font-semibold text-white">{pedigree.gen3.dam?.dam?.name || "—"}</div>
                          {pedigree.gen3.dam?.dam?.country && <div className="text-xs uppercase text-gray-400 mt-1">{pedigree.gen3.dam.dam.country}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generation 4 */}
                {gen >= 4 && pedigree.gen4 && (
                  <div className="flex gap-8 mb-12">
                    {/* 4 branches for gen4 */}
                    {["sire.sire", "sire.dam", "dam.sire", "dam.dam"].map((path, i) => {
                      const parts = path.split(".");
                      const branch = parts.reduce((obj, key) => obj?.[key], pedigree.gen4);
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-52 bg-gray-900/70 border-2 border-gray-600 rounded-lg p-4 text-center">
                            <div className="font-medium text-white text-sm">{branch?.sire?.name || "—"}</div>
                            {branch?.sire?.country && <div className="text-xs uppercase text-gray-400">{branch.sire.country}</div>}
                          </div>
                          <div className="h-8 w-0.5 bg-gray-600 my-2"></div>
                          <div className="w-52 bg-pink-900/30 border-2 border-pink-700 rounded-lg p-4 text-center">
                            <div className="font-medium text-white text-sm">{branch?.dam?.name || "—"}</div>
                            {branch?.dam?.country && <div className="text-xs uppercase text-gray-400">{branch.dam.country}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Generation 5 & 6 can be added similarly with more branches if needed */}
              </div>
            </div>
          )}

          {/* No horses found */}
          {!loading && !error && pedigree && allHorses.length === 0 && <div className="text-center text-gray-400 text-xl">No horse data found in the response.</div>}
        </div>
      </main>
    </MainLayout>
  );
};

export default RealPedigreePage;
