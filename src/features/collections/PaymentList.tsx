import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";
import type { Payment } from "../../types/payment";
import type { Member } from "../../types/member";

interface PaymentListProps {
  chit: Chit;
  cycle: Cycle;
  refreshKey: number;
}

interface PaymentWithMember {
  payment: Payment;
  member?: Member;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function PaymentList({
  chit,
  cycle,
  refreshKey,
}: PaymentListProps) {
  const [payments, setPayments] =
    useState<PaymentWithMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);

      const results = await db.payments
        .where("cycleId")
        .equals(cycle.id!)
        .toArray();

      const paymentRows =
        await Promise.all(
          results.map(async (payment) => {
            const member =
              await db.members.get(
                payment.memberId,
              );

            return {
              payment,
              member,
            };
          }),
        );

      setPayments(paymentRows);
      setLoading(false);
    };

    loadPayments();
  }, [cycle.id, refreshKey]);

  const totalCollected =
    payments.reduce(
      (total, row) =>
        total + row.payment.amountPaid,
      0,
    );

  const totalDue =
    payments.reduce(
      (total, row) =>
        total + row.payment.amountDue,
      0,
    );

  const totalOutstanding = Math.max(
    0,
    totalDue - totalCollected,
  );

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
          Loading payments...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Payments Recorded
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {payments.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Collected
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalCollected)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Outstanding
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {formatCurrency(totalOutstanding)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Collection
          </p>

          <p className="mt-1 text-2xl font-bold text-violet-600">
            {collectionPercentage.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {payments.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              No payments recorded
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No payments have been recorded for
              Month {cycle.monthNumber} yet.
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
                    Date
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Method
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map(
                  ({
                    payment,
                    member,
                  }) => {
                    const balance =
                      Math.max(
                        0,
                        payment.amountDue -
                          payment.amountPaid,
                      );

                    return (
                      <tr
                        key={payment.id}
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {member?.name ??
                              "Unknown Member"}
                          </p>

                          {member && (
                            <p className="text-xs text-slate-500">
                              {
                                member.memberNumber
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {formatCurrency(
                            payment.amountDue,
                          )}
                        </td>

                        <td className="px-5 py-4 font-medium text-emerald-600">
                          {formatCurrency(
                            payment.amountPaid,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {balance === 0 ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              Paid
                            </span>
                          ) : (
                            <span className="font-medium text-red-600">
                              {formatCurrency(
                                balance,
                              )}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {payment.paymentDate}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {payment.paymentMethod}
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

      {/* Chit information */}
      <div className="mt-4 text-right text-xs text-slate-400">
        {chit.name} · Month{" "}
        {cycle.monthNumber}
      </div>
    </div>
  );
}

export default PaymentList;
