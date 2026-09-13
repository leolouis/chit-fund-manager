import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Member } from "../../types/member";

interface OutstandingListProps {
  refreshKey: number;
}

interface OutstandingRow {
  memberId: number;
  memberNumber: number;
  memberName: string;
  chitName: string;
  monthlyAmount: number;
  monthsDue: number;
  totalDue: number;
  totalPaid: number;
  outstanding: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function OutstandingList({
  refreshKey,
}: OutstandingListProps) {
  const [rows, setRows] = useState<OutstandingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutstanding = async () => {
      setLoading(true);

      const members =
        await db.members
          .where("status")
          .equals("active")
          .toArray();

      const payments =
        await db.payments.toArray();

      const chits = await db.chits.toArray();

      const results: OutstandingRow[] = [];

      for (const member of members) {
        const chit = chits.find(
          (item) => item.id === member.chitId,
        );

        if (!chit) {
          continue;
        }

        /*
         * For now, the number of months due is based
         * on the current month of the chit.
         *
         * Later we will replace this with the proper
         * monthly-cycle system.
         */
        const startDate = new Date(
          `${chit.startDate}T00:00:00`,
        );

        const today = new Date();

        let monthsDue =
          (today.getFullYear() -
            startDate.getFullYear()) *
            12 +
          (today.getMonth() -
            startDate.getMonth()) +
          1;

        monthsDue = Math.max(
          1,
          Math.min(
            monthsDue,
            chit.durationMonths,
          ),
        );

        const memberPayments =
          payments.filter(
            (payment) =>
              payment.memberId === member.id &&
              payment.chitId === chit.id,
          );

        const totalPaid =
          memberPayments.reduce(
            (total, payment) =>
              total + payment.amountPaid,
            0,
          );

        const totalDue =
          monthsDue * chit.monthlyAmount;

        const outstanding = Math.max(
          0,
          totalDue - totalPaid,
        );

        results.push({
          memberId: member.id!,
          memberNumber:
            member.memberNumber,
          memberName: member.name,
          chitName: chit.name,
          monthlyAmount:
            chit.monthlyAmount,
          monthsDue,
          totalDue,
          totalPaid,
          outstanding,
        });
      }

      setRows(results);
      setLoading(false);
    };

    loadOutstanding();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Calculating outstanding balances...
        </p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No active members
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Add members to an active chit first.
        </p>
      </div>
    );
  }

  const totalDue = rows.reduce(
    (total, row) => total + row.totalDue,
    0,
  );

  const totalPaid = rows.reduce(
    (total, row) => total + row.totalPaid,
    0,
  );

  const totalOutstanding = rows.reduce(
    (total, row) =>
      total + row.outstanding,
    0,
  );

  return (
    <div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Due
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(totalDue)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Collected
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Outstanding
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {formatCurrency(totalOutstanding)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-600">
                  Member
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Chit
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Months
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Due
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Paid
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Outstanding
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.memberId}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">
                      #{row.memberNumber}{" "}
                      {row.memberName}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {row.chitName}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {row.monthsDue}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatCurrency(
                      row.totalDue,
                    )}
                  </td>

                  <td className="px-5 py-4 text-emerald-700">
                    {formatCurrency(
                      row.totalPaid,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        row.outstanding > 0
                          ? "font-semibold text-red-600"
                          : "font-semibold text-emerald-600"
                      }
                    >
                      {formatCurrency(
                        row.outstanding,
                      )}
                    </span>
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

export default OutstandingList;
