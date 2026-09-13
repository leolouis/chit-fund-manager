import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";

function AuctionsPage() {
  const [chits, setChits] = useState<Chit[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);

  const [selectedChitId, setSelectedChitId] =
    useState("");

  const [selectedCycleId, setSelectedCycleId] =
    useState("");

  useEffect(() => {
    const loadChits = async () => {
      const results = await db.chits
        .where("status")
        .equals("active")
        .toArray();

      setChits(results);

      if (
        results.length > 0 &&
        !selectedChitId
      ) {
        setSelectedChitId(
          String(results[0].id),
        );
      }
    };

    loadChits();
  }, [selectedChitId]);

  useEffect(() => {
    const loadCycles = async () => {
      if (!selectedChitId) {
        setCycles([]);
        setSelectedCycleId("");
        return;
      }

      const results = await db.cycles
        .where("chitId")
        .equals(Number(selectedChitId))
        .sortBy("monthNumber");

      setCycles(results);

      if (results.length > 0) {
        const openCycle = results.find(
          (cycle) => cycle.status === "open",
        );

        setSelectedCycleId(
          String(
            (openCycle ?? results[0]).id,
          ),
        );
      } else {
        setSelectedCycleId("");
      }
    };

    loadCycles();
  }, [selectedChitId]);

  const selectedChit = chits.find(
    (chit) =>
      chit.id === Number(selectedChitId),
  );

  const selectedCycle = cycles.find(
    (cycle) =>
      cycle.id === Number(selectedCycleId),
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Auctions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Manage monthly chit auctions and winners.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Chit
            </label>

            <select
              value={selectedChitId}
              onChange={(event) => {
                setSelectedChitId(
                  event.target.value,
                );
                setSelectedCycleId("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">
                Select a chit
              </option>

              {chits.map((chit) => (
                <option
                  key={chit.id}
                  value={chit.id}
                >
                  {chit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monthly Cycle
            </label>

            <select
              value={selectedCycleId}
              onChange={(event) =>
                setSelectedCycleId(
                  event.target.value,
                )
              }
              disabled={cycles.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none disabled:bg-slate-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              {cycles.length === 0 ? (
                <option value="">
                  No cycles available
                </option>
              ) : (
                cycles.map((cycle) => (
                  <option
                    key={cycle.id}
                    value={cycle.id}
                  >
                    Month {cycle.monthNumber} —{" "}
                    {cycle.dueDate}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {selectedChit &&
        selectedCycle && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              Auction for Month{" "}
              {selectedCycle.monthNumber}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {selectedChit.name}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              No auction recorded yet.
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              + Record Auction
            </button>
          </div>
        )}

      {!selectedChit && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-900">
            Select a chit
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Select a chit above to manage its auctions.
          </p>
        </div>
      )}
    </div>
  );
}

export default AuctionsPage;
