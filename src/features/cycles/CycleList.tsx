import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";

interface CycleListProps {
  chitId: number;
  refreshKey: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CycleList({
  chitId,
  refreshKey,
}: CycleListProps) {
  const [chit, setChit] =
    useState<Chit | undefined>();

  const [cycles, setCycles] =
    useState<Cycle[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadCycles = async () => {
      setLoading(true);

      const selectedChit =
        await db.chits.get(chitId);

      const selectedCycles =
        await db.cycles
          .where("chitId")
          .equals(chitId)
          .sortBy("monthNumber");

      setChit(selectedChit);
      setCycles(selectedCycles);
      setLoading(false);
    };

    loadCycles();
  }, [chitId, refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading monthly cycles...
        </p>
      </div>
    );
  }

  if (!chit) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">
          Chit not found.
        </p>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No cycles found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          This chit does not have monthly cycles yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {chit.name}
        </h3>

        <div className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-slate-500">
              Monthly Contribution
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatCurrency(
                chit.monthlyAmount,
              )}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Duration
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {chit.durationMonths} months
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Members
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {chit.memberCount}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-600">
                  Month
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Due Date
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Monthly Due
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {cycles.map((cycle) => (
                <tr key={cycle.id}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Month {cycle.monthNumber}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {cycle.dueDate}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatCurrency(
                      chit.monthlyAmount,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {cycle.status === "completed" && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Completed
                      </span>
                    )}

                    {cycle.status === "open" && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Open
                      </span>
                    )}

                    {cycle.status === "upcoming" && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Upcoming
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CycleList;
