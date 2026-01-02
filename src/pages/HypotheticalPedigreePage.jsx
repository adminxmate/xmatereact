import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

const HypotheticalPedigreePage = () => {
  const [searchParams] = useSearchParams();

  const sireId = searchParams.get("sireid") || "497875";
  const damId = searchParams.get("damid") || "376952";
  const gen = Math.min(parseInt(searchParams.get("gen")) || 3);

  const [pedigree, setPedigree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedigree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://haves.co.in/api/v1/horses/hypo?sireid=${sireId}&damid=${damId}&gen=${gen - 1}`);
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

  const renderCell = (horse, genLevel, totalGen, cellIndex) => {
    console.log('h-', horse, 'id-',cellIndex+1);
    const rowspan = Math.pow(2, totalGen - genLevel - 1);
    const key = horse?.id ? `${horse.id}-${genLevel}` : `empty-${genLevel}-${cellIndex}`;    
    const horsedetails = `${horse.sex}-${horse.dob ? new Date(horse.dob).getFullYear() : ''}`;
    const tdclass = `px-4 py-2 text-left align-middle ${horse.generation === 0 ? '' : horse.relationType === 'dam' ? 'borderbottom' : 'borderleft'}` ;
    if (!horse) {
      return (
        <td key={key} rowSpan={rowspan} class="border px-4 py-2 text-center align-middle bg-gray-800/40 text-gray-500 italic">
          —
        </td>
      );
    }
    return (
      <td key={key} rowSpan={rowspan} className={tdclass}>
        <div className="font-bold" data-id={horse.id} data-d={horsedetails}>{horse.name || "Unknown"}</div>
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
              <span horseid="{sireId}" className="text-white">
                {pedigree?.pedigree?.[0]?.[0]?.name || "Unknown Horse"}
              </span>{" "}
              -{" "}
              <span horseid="{damId}" className="text-white">
                {pedigree?.pedigree?.[0]?.[1]?.name || "Unknown Horse"}
              </span>
              <br />
              <span>(Generation: {gen})</span>
            </h1>
          </div>

          {loading && <div className="text-center text-2xl text-yellow-400">Loading hypothetical pedigree...</div>}

          {error && (
            <div className="text-center bg-red-900/50 border-2 border-red-600 rounded-xl p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-xl">{error}</p>
            </div>
          )}

          {!loading && !error && pedigree && pedigree.pedigree && (
            <div className="overflow-x-auto">
              <table className="pedigree-table table-auto border-collapse bg-white text-black border border-gray-700 w-full">
                <tbody>{buildRows(pedigree.pedigree)}</tbody>
              </table>
            </div>
          )}
          {!loading && !error && pedigree && !pedigree.pedigree && <div className="text-center text-gray-400 text-xl">No pedigree data available for the selected generation.</div>}
        </div>
      </main>
    </MainLayout>
  );
};

export default HypotheticalPedigreePage;
