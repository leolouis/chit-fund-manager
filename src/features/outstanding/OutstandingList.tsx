import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";
import type { Member } from "../../types/member";
import type { Payment } from "../../types/payment";

interface OutstandingListProps {
refreshKey: number;
}

interface OutstandingRow {
memberId: number;
memberNumber: string;
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
try {
setLoading(true);

    const members = await db.members
      .where("status")
      .equals("active")
      .toArray();

    const chits = await db.chits.toArray();
    const cycles = await db.cycles.toArray();
    const payments = await db.payments.toArray();

    const results: OutstandingRow[] = [];

    for (const member of members) {
      const chit = chits.find(
        (item) => item.id === member.chitId,
      );

      if (!chit) {
        continue;
      }

      const chitCycles = cycles
        .filter(
          (cycle) => cycle.chitId === chit.id,
        )
        .sort(
          (a, b) =>
            a.monthNumber - b.monthNumber,
        );

      const dueCycles = chitCycles.filter(
        (cycle) =>
          cycle.status === "completed" ||
          cycle.status === "open",
      );

      const memberPayments = payments.filter(
        (payment) =>
          payment.memberId === member.id &&
          payment.chitId === chit.id,
      );

      const totalPaid = memberPayments.reduce(
        (total, payment) =>
          total + payment.amountPaid,
        0,
      );

      const monthsDue = dueCycles.length;

      const totalDue =
        monthsDue * chit.monthlyAmount;

      const outstanding = Math.max(
        0,
        totalDue - totalPaid,
      );

      results.push({
        memberId: member.id!,
        memberNumber: String(
          member.memberNumber,
        ),
        memberName: member.name,
        chitName: chit.name,
        monthlyAmount: chit.monthlyAmount,
        monthsDue,
        totalDue,
        totalPaid,
        outstanding,
      });
    }

    results.sort(
      (a, b) =>
        b.outstanding - a.outstanding,
    );

    setRows(results);
  } catch (error) {
    console.error(
      "Unable to calculate outstanding:",
      error,
    );

    setRows([]);
  } finally {
    setLoading(false);
  }
};

loadOutstanding();


}, [refreshKey]);

if (loading) {
return (
<div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
<div className="flex items-center gap-3">
<div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

      <p className="text-sm text-slate-500">
        Calculating outstanding balances...
      </p>
    </div>
  </div>
);


}

if (rows.length === 0) {
return (
<div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-xl text-violet-600">
₹
</div>

    <h3 className="mt-4 font-semibold text-slate-900">
      No active members
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
      Add members to an active chit first to
      start tracking outstanding payments.
    </p>
  </div>
);


}

const totalDue = rows.reduce(
(total, row) =>
total + row.totalDue,
0,
);

const totalPaid = rows.reduce(
(total, row) =>
total + row.totalPaid,
0,
);

const totalOutstanding = rows.reduce(
(total, row) =>
total + row.outstanding,
0,
);

const membersWithOutstanding =
rows.filter(
(row) => row.outstanding > 0,
).length;

const fullyPaidMembers = rows.filter(
(row) =>
row.totalDue > 0 &&
row.outstanding === 0,
).length;

const collectionPercentage =
totalDue > 0
? Math.min(
100,
(totalPaid / totalDue) * 100,
)
: 0;

return (
<div className="space-y-6">
{/* Summary Cards */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
<div className="flex items-start justify-between">
<div>
<p className="text-sm font-medium text-slate-500">
Total Due
</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalDue)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across {rows.length} active members
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          ₹
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Collected
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {collectionPercentage.toFixed(0)}%
            collected
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          ✓
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-red-600">
            Total Outstanding
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-red-700">
            {formatCurrency(totalOutstanding)}
          </p>

          <p className="mt-1 text-xs text-red-500">
            {membersWithOutstanding} members pending
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
          !
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Fully Paid
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
            {fullyPaidMembers}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Members fully settled
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          ✓
        </div>
      </div>
    </div>
  </div>

  {/* Collection Progress */}
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Overall Collection Progress
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Collected versus total amount due
        </p>
      </div>

      <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
        {collectionPercentage.toFixed(0)}%
      </span>
    </div>

    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-500"
        style={{
          width: `${collectionPercentage}%`,
        }}
      />
    </div>

    <div className="mt-3 flex justify-between text-xs text-slate-400">
      <span>
        Collected {formatCurrency(totalPaid)}
      </span>

      <span>
        Due {formatCurrency(totalDue)}
      </span>
    </div>
  </div>

  {/* Outstanding Members */}
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">
            Member Payment Status
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            Detailed outstanding balances for each member
          </p>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {rows.length} Members
        </span>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-600">
              Member
            </th>

            <th className="px-5 py-3 font-semibold text-slate-600">
              Chit
            </th>

            <th className="px-5 py-3 text-center font-semibold text-slate-600">
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

            <th className="px-5 py-3 font-semibold text-slate-600">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const status =
              row.outstanding === 0
                ? "Paid"
                : row.totalPaid > 0
                  ? "Partial"
                  : "Pending";

            return (
              <tr
                key={row.memberId}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                      {row.memberName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {row.memberName}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Member #{row.memberNumber}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="font-medium text-slate-700">
                    {row.chitName}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {row.monthsDue}
                  </span>
                </td>

                <td className="px-5 py-4 font-medium text-slate-700">
                  {formatCurrency(row.totalDue)}
                </td>

                <td className="px-5 py-4 font-semibold text-emerald-600">
                  {formatCurrency(row.totalPaid)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={
                      row.outstanding > 0
                        ? "font-bold text-red-600"
                        : "font-semibold text-emerald-600"
                    }
                  >
                    {formatCurrency(row.outstanding)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {status === "Paid" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Paid
                    </span>
                  )}

                  {status === "Partial" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Partial
                    </span>
                  )}

                  {status === "Pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>


);
}

export default OutstandingList;
