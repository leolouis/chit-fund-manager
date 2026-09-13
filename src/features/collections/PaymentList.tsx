import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";
import type { Member } from "../../types/member";
import type { Payment } from "../../types/payment";

interface PaymentListProps {
  chit: Chit;
  cycle: Cycle;
  refreshKey: number;
}

interface MemberCollection {
  member: Member;
  payments: Payment[];
  amountDue: number;
  amountPaid: number;
  balance: number;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function PaymentList({
  chit,
  cycle,
  refreshKey,
}: PaymentListProps) {
  const [collections, setCollections] = useState<
    MemberCollection[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);

      const members = await db.members
        .where("chitId")
        .equals(chit.id!)
        .toArray();

      const activeMembers = members.filter(
        (member) =>
          member.status === "active",
      );

      const payments = await db.payments
        .where("cycleId")
        .equals(cycle.id!)
        .toArray();

      const rows: MemberCollection[] =
        activeMembers.map((member) => {
          const memberPayments =
            payments.filter(
              (payment) =>
                payment.memberId === member.id,
            );

          const amountPaid =
            memberPayments.reduce(
              (total, payment) =>
                total + payment.amountPaid,
              0,
            );

          const amountDue =
            chit.monthlyAmount;

          const balance = Math.max(
            0,
            amountDue - amountPaid,
          );

          return {
            member,
            payments: memberPayments,
            amountDue,
            amountPaid,
            balance,
          };
        });

      rows.sort((a, b) =>
        a.member.memberNumber.localeCompare(
          b.member.memberNumber,
          undefined,
          { numeric: true },
        ),
      );

      setCollections(rows);
      setLoading(false);
    };

    loadCollections();
  }, [
    chit.id,
    chit.monthlyAmount,
    cycle.id,
    refreshKey,
  ]);

  const totalDue = collections.reduce(
    (total, row) =>
      total + row.amountDue,
    0,
  );

  const totalCollected =
    collections.reduce(
      (total, row) =>
        total + row.amountPaid,
      0,
    );

  const totalOutstanding =
    collections.reduce(
      (total, row) =>
        total + row.balance,
      0,
    );

  const paidCount = collections.filter(
    (row) =>
      row.amountPaid >= row.amountDue,
  ).length;

  const partialCount = collections.filter(
    (row) =>
      row.amountPaid > 0 &&
      row.amountPaid < row.amountDue,
  ).length;

  const pendingCount = collections.filter(
    (row) =>
      row.amountPaid === 0,
  ).length;

  const collectionPercentage =
    totalDue > 0
      ? Math.min(
          100,
          (totalCollected / totalDue) * 100,
        )
      : 0;

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading collections...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Expected
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(totalDue)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {collections.length} members
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Collected
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalCollected)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {collectionPercentage.toFixed(0)}%
            collected
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Outstanding
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {formatCurrency(totalOutstanding)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Still to collect
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Member Status
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
              {paidCount} Paid
            </span>

            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
              {partialCount} Partial
            </span>

            <span className="rounded-full bg-red-100 px-2.5 py-1 font-medium text-red-700">
              {pendingCount} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            Collection Progress
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

      {/* Member Collection Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {collections.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              No active members
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add members to this chit before
              recording collections.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Member
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Due
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Paid
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Balance
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Payment
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {collections.map(
                  (row) => {
                    let status:
                      | "paid"
                      | "partial"
                      | "pending";

                    if (
                      row.amountPaid >=
                      row.amountDue
                    ) {
                      status = "paid";
                    } else if (
                      row.amountPaid > 0
                    ) {
                      status = "partial";
                    } else {
                      status = "pending";
                    }

                    return (
                      <tr
                        key={row.member.id}
                        className="hover:bg-slate-50"
                      >
                        {/* Member */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {row.member.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              row.member
                                .memberNumber
                            }
                          </p>
                        </td>

                        {/* Due */}
                        <td className="px-5 py-4 text-slate-700">
                          {formatCurrency(
                            row.amountDue,
                          )}
                        </td>

                        {/* Paid */}
                        <td className="px-5 py-4 font-medium text-emerald-600">
                          {formatCurrency(
                            row.amountPaid,
                          )}
                        </td>

                        {/* Balance */}
                        <td className="px-5 py-4">
                          <span
                            className={
                              row.balance === 0
                                ? "text-emerald-600"
                                : "font-medium text-red-600"
                            }
                          >
                            {formatCurrency(
                              row.balance,
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {status === "paid" && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              Paid
                            </span>
                          )}

                          {status === "partial" && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                              Partial
                            </span>
                          )}

                          {status === "pending" && (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          {row.payments.length >
                          0 ? (
                            <div>
                              <p className="text-xs text-slate-500">
                                {
                                  row
                                    .payments[
                                    row
                                      .payments
                                      .length -
                                      1
                                  ]
                                    .paymentDate
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                {
                                  row
                                    .payments[
                                    row
                                      .payments
                                      .length -
                                      1
                                  ]
                                    .paymentMethod
                                }
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No payment
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-right text-xs text-slate-400">
        {chit.name} · Month{" "}
        {cycle.monthNumber}
      </div>
    </div>
  );
}

export default PaymentList;
