import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

const RealPedigreePage = () => {
  const [searchParams] = useSearchParams();

  const horseId = searchParams.get("horseid") || "528492";
  const gen = parseInt(searchParams.get("gen")) || 3;

  const [pedigree, setPedigree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedigree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://haves.co.in/api/v1/horses/real?horseid=${horseId}&gen=${gen - 1}`);
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

  const renderCell = (horse, genLevel, totalGen, cellIndex) => {
    if (!horse) return null;
    const rowspan = Math.pow(2, totalGen - genLevel - 1);
    const key = horse?.id ? `${horse.id}-${genLevel}` : `empty-${genLevel}-${cellIndex}`;
    const horsedetails = `${horse.sex}-${horse.dob ? new Date(horse.dob).getFullYear() : ''}`;    
    const tdclass = `px-4 py-2 text-left align-middle ${horse.generation === 0 ? '' : horse.relationType === 'dam' ? 'borderbottom' : 'borderleft'}` ;
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
        rows[rowIndex].push(renderCell(horse, genLevel, totalGen, cellIndex));
        rowIndex += span;
      });
    });

    return rows.map((cells, i) => <tr key={i}>{cells}</tr>);
  };

  return (
    <MainLayout>
      <section className="min-h-screen text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 horseid={horseId} className="text-4xl font-bold text-center mb-8">
              {pedigree?.pedigree?.[0]?.[0]?.name || "Unknown Horse"}
              <br />
              <span>(Generation: {gen})</span>
            </h1>
          </div>
          {loading && <div className="text-center text-xl text-yellow-400">Loading data from API...</div>}

          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
              <p className="text-lg">{error}</p>
            </div>
          )}

          {!loading && pedigree && pedigree.pedigree && (
            <div className="overflow-x-auto">
              <table className="pedigree-table table-auto bg-white border-collapse text-black border border-gray-700 w-full">
                <tbody>{buildRows(pedigree.pedigree)}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default RealPedigreePage;
