import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";

import CycleList from "./CycleList";

function CyclesPage() {
  const [chits, setChits] =
    useState<Chit[]>([]);

  const [selectedChitId, setSelectedChitId] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Monthly Cycles
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            View the monthly schedule for your chits.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setRefreshKey(
              (value) => value + 1,
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {chits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-900">
            No active chits
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Create a chit first to see its monthly
            cycles.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select Chit
            </label>

            <select
              value={selectedChitId}
              onChange={(event) =>
                setSelectedChitId(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
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

          {selectedChitId && (
            <CycleList
              chitId={Number(
                selectedChitId,
              )}
              refreshKey={refreshKey}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CyclesPage;
