import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";

interface ChitListProps {
  refreshKey: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ChitList({ refreshKey }: ChitListProps) {
  const [chits, setChits] = useState<Chit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChits = async () => {
      setLoading(true);

      const results = await db.chits
        .orderBy("createdAt")
        .reverse()
        .toArray();

      setChits(results);
      setLoading(false);
    };

    loadChits();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading chits...
        </p>
      </div>
    );
  }

  if (chits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No chits yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create your first chit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 font-semibold text-slate-600">
                Chit
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Monthly
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Members
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Duration
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Start Date
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {chits.map((chit) => (
              <tr key={chit.id}>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">
                    {chit.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    {formatCurrency(chit.chitAmount)}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {formatCurrency(chit.monthlyAmount)}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {chit.memberCount}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {chit.durationMonths} months
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {chit.startDate}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {chit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChitList;
