import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Payment } from "../../types/payment";
import type { Member } from "../../types/member";
import type { Chit } from "../../types/chit";

interface CollectionListProps {
  refreshKey: number;
}

interface PaymentRow extends Payment {
  memberName: string;
  chitName: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CollectionList({
  refreshKey,
}: CollectionListProps) {
  const [payments, setPayments] = useState<
    PaymentRow[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);

      const allPayments = await db.payments
        .orderBy("paymentDate")
        .reverse()
        .toArray();

      const rows: PaymentRow[] = [];

      for (const payment of allPayments) {
        const member = await db.members.get(
          payment.memberId,
        );

        const chit = await db.chits.get(
          payment.chitId,
        );

        rows.push({
          ...payment,
          memberName: member?.name ?? "Unknown Member",
          chitName: chit?.name ?? "Unknown Chit",
        });
      }

      setPayments(rows);
      setLoading(false);
    };

    loadPayments();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading payments...
        </p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No payments recorded
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Record your first member payment.
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
                Member
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Chit
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Month
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Due
              </th>

              <th className="px-5 py-3 font-semibold text-slate-600">
                Paid
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
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {payment.memberName}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {payment.chitName}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {payment.monthNumber}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {formatCurrency(payment.amountDue)}
                </td>

                <td className="px-5 py-4 font-medium text-emerald-700">
                  {formatCurrency(payment.amountPaid)}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {payment.paymentDate}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {payment.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CollectionList;
