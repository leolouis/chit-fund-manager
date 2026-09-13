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
  const [rows, setRows] = useState<
    OutstandingRow[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadOutstanding = async () => {
      try {
        setLoading(true);

        const members =
          await db.members
            .where("status")
            .equals("active")
            .toArray();

        const chits =
          await db.chits.toArray();

        const cycles =
          await db.cycles.toArray();

        const payments =
          await db.payments.toArray();

        const results: OutstandingRow[] =
          [];

        for (const member of members) {
          const chit = chits.find(
            (item) =>
              item.id === member.chitId,
          );

          if (!chit) {
            continue;
          }

          /*
           * Only count cycles that actually exist
           * for this chit.
           */
          const chitCycles = cycles
            .filter(
              (cycle) =>
                cycle.chitId === chit.id,
            )
            .sort(
              (a, b) =>
                a.monthNumber -
                b.monthNumber,
            );

          /*
           * Only cycles up to the current/open
           * cycle are considered due.
           *
           * Upcoming cycles are not outstanding.
           */
          const dueCycles =
            chitCycles.filter(
              (cycle) =>
                cycle.status ===
                  "completed" ||
                cycle.status === "open",
            );

          const memberPayments =
            payments.filter(
              (payment) =>
                payment.memberId ===
                  member.id &&
                payment.chitId ===
                  chit.id,
            );

          const totalPaid =
            memberPayments.reduce(
              (total, payment) =>
                total +
                payment.amountPaid,
              0,
            );

          const monthsDue =
            dueCycles.length;

          const totalDue =
            monthsDue *
            chit.monthlyAmount;

          const outstanding =
            Math.max(
              0,
              totalDue - totalPaid,
            );

          results.push({
            memberId: member.id!,
            memberNumber:
              String(
                member.memberNumber,
              ),
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

        /*
         * Show members with the largest
         * outstanding balance first.
         */
        results.sort(
          (a, b) =>
            b.outstanding -
            a.outstanding,
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

  const totalDue =
    rows.reduce(
      (total, row) =>
        total + row.totalDue,
      0,
    );

  const totalPaid =
    rows.reduce(
      (total, row) =>
        total + row.totalPaid,
      0,
    );

  const totalOutstanding =
    rows.reduce(
      (total, row) =>
        total + row.outstanding,
      0,
    );

  const membersWithOutstanding =
    rows.filter(
      (row) =>
        row.outstanding > 0,
    ).length;

  const fullyPaidMembers =
    rows.filter(
      (row) =>
        row.totalDue > 0 &&
        row.outstanding === 0,
    ).length;

  const collectionPercentage =
    totalDue > 0
      ? Math.min(
          100,
          (totalPaid / totalDue) *
            100,
        )
      : 0;

  return (
    <div>
      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Due
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(totalDue)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across {rows.length} active members
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Collected
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {collectionPercentage.toFixed(0)}%
            collected
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm text-red-600">
            Total Outstanding
          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">
            {formatCurrency(
              totalOutstanding,
            )}
          </p>

          <p className="mt-1 text-xs text-red-500">
            {membersWithOutstanding} members
            pending
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Fully Paid
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {fullyPaidMembers}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Members fully settled
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            Overall Collection Progress
          </p>

          <p className="text-sm font-semibold text-violet-600">
            {collectionPercentage.toFixed(0)}%
          </p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{
              width: `${collectionPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Table */}
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
                  Months Due
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
                    className="hover:bg-slate-50"
                  >
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

                    <td className="px-5 py-4 font-medium text-emerald-600">
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

                    <td className="px-5 py-4">
                      {status === "Paid" && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Paid
                        </span>
                      )}

                      {status === "Partial" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Partial
                        </span>
                      )}

                      {status === "Pending" && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
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
