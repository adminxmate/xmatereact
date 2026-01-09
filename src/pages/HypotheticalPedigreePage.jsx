import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { useAuth } from "../hooks/useAuth";

const HypotheticalPedigreePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const sireId = searchParams.get("sireid");
  const damId = searchParams.get("damid");

  useEffect(() => {
    if (!sireId || !damId) {
      navigate("/", { replace: true });
    }
  }, [sireId, damId, navigate]);

  const gen = parseInt(searchParams.get("gen")) || 3;

  const [pedigree, setPedigree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    const fetchPedigree = async () => {
      setLoading(true);
      setError(null);
      setComingSoon(false);

      if (gen === 6) {
        setLoading(false);
        setComingSoon(true);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}api/v1/horses/hypo?sireid=${sireId}&damid=${damId}&gen=${gen - 1}`
        );
        setPedigree(response.data);
      } catch (err) {
        console.error("Hypothetical pedigree fetch error:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load hypothetical pedigree"
        );
      } finally {
        setLoading(false);
      }
    };

    if (sireId && damId) {
      fetchPedigree();
    }
  }, [sireId, damId, gen]);

  const handleGenChange = (newGen) => {
    if (!isLoggedIn) {
      const event = new CustomEvent("open-login-modal", {
        detail: { reason: "manual" },
      });
      window.dispatchEvent(event);
      return;
    }

    setSearchParams({ sireid: sireId, damid: damId, gen: newGen });
  };

  const renderCell = (horse, genLevel, totalGen, cellIndex) => {
    const bgClass = horse?.isDuplicate ? horse.color : "";
    const rowspan = Math.pow(2, totalGen - genLevel - 1);
    const key = horse?.id
      ? `${horse.id}-${genLevel}`
      : `empty-${genLevel}-${cellIndex}`;
    const horsedetails = `${horse?.sex || ""}-${
      horse?.dob ? new Date(horse.dob).getFullYear() : ""
    }`;
    const tdclass = `p-1 text-left align-middle max-w-[150px] ${
      horse?.generation === 0
        ? ""
        : horse?.relationType === "dam"
        ? "borderbottom"
        : "borderleft"
    }`;
    if (!horse) {
      return (
        <td
          key={key}
          rowSpan={rowspan}
          className="border px-4 py-2 text-center align-middle bg-gray-800/40 text-gray-500 italic"
        >
          —
        </td>
      );
    }
    return (
      <td key={key} rowSpan={rowspan} className={tdclass}>
        <div
          className="text-gray-800 break-all"
          style={{ backgroundColor: bgClass }}
          data-id={horse.id}
          data-d={horsedetails}
        >
          {horse.name || "Unknown"}
        </div>
      </td>
    );
  };

  const buildRows = (pedigreeLevels) => {
    const totalGen = pedigreeLevels.length;
    const totalRows = Math.pow(2, totalGen - 1);
    const rows = Array.from({ length: totalRows }, () => []);

    pedigreeLevels.forEach((generation, genLevel) => {
      const span = Math.pow(2, totalGen - genLevel - 1);
      let rowIndex = 0;

      generation.forEach((horse, cellIndex) => {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }
        rows[rowIndex].push(renderCell(horse, genLevel, totalGen, cellIndex));
        rowIndex += span;
      });
    });

    return rows.map((cells, i) => <tr key={i}>{cells}</tr>);
  };

  return (
    <MainLayout>
      <main className="min-h-screen text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Hypothetical -  
              <span className="text-white">
                {pedigree?.pedigree?.[0]?.[0]?.name || "Unknown Horse"}
              </span>{" "}
              -{" "}
              <span className="text-white">
                {pedigree?.pedigree?.[0]?.[1]?.name || "Unknown Horse"}
              </span>
            </h1>

            <div className="flex justify-center gap-2 mt-4">
              {[3, 4, 5, 6].map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenChange(g)}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all ${
                    gen === g
                      ? "bg-red-600 text-white scale-110 shadow-lg shadow-red-900/20"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {g} GENERATIONS
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center text-2xl text-yellow-400">
              Loading hypothetical pedigree...
            </div>
          )}

          {comingSoon && (
            <div className="bg-gray-100 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
              <h2 className="text-black text-2xl font-bold mb-2">COMING SOON</h2>
            </div>
          )}

          {error && (
            <div className="text-center bg-red-900/50 border-2 border-red-600 rounded-xl p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-xl">{error}</p>
            </div>
          )}

          {!loading && !error && !comingSoon && pedigree?.pedigree && (
            <div className="overflow-x-auto">
              <table className="pedigree-table table-auto border-collapse  rounded-xl bg-white text-black border border-gray-700 w-full">
                <tbody>{buildRows(pedigree.pedigree)}</tbody>
              </table>
            </div>
          )}

          {!loading && !error && !comingSoon && pedigree && !pedigree.pedigree && (
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
