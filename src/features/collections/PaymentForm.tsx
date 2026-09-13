import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";
import type { Member } from "../../types/member";

interface PaymentFormProps {
  chit: Chit;
  cycle: Cycle;
  onSaved: () => void;
  onCancel: () => void;
}

function PaymentForm({
  chit,
  cycle,
  onSaved,
  onCancel,
}: PaymentFormProps) {
  const [members, setMembers] = useState<Member[]>(
    [],
  );

  const [memberId, setMemberId] =
    useState("");

  const [amountPaid, setAmountPaid] =
    useState(String(chit.monthlyAmount));

  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);

      const results = await db.members
        .where("chitId")
        .equals(chit.id!)
        .toArray();

      setMembers(
        results.filter(
          (member) =>
            member.status === "active",
        ),
      );

      setLoading(false);
    };

    loadMembers();
  }, [chit.id]);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    const paid = Number(amountPaid);

    if (!amountPaid || paid <= 0) {
      setError(
        "Please enter a valid payment amount.",
      );
      return;
    }

    if (!paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      await db.payments.add({
        chitId: chit.id!,
        memberId: Number(memberId),
        cycleId: cycle.id!,
        monthNumber: cycle.monthNumber,
        amountDue: chit.monthlyAmount,
        amountPaid: paid,
        paymentDate,
        paymentMethod,
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      });

      onSaved();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save the payment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Record Payment
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {chit.name} · Month{" "}
          {cycle.monthNumber}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Member */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Member
          </label>

          <select
            value={memberId}
            onChange={(event) =>
              setMemberId(event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-100"
          >
            <option value="">
              {loading
                ? "Loading members..."
                : "Select member"}
            </option>

            {members.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.memberNumber} —{" "}
                {member.name}
              </option>
            ))}
          </select>

          {!loading &&
            members.length === 0 && (
              <p className="mt-2 text-xs text-amber-600">
                No active members found for this
                chit. Add members before recording
                payments.
              </p>
            )}
        </div>

        {/* Due Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount Due
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900">
            ₹
            {chit.monthlyAmount.toLocaleString(
              "en-IN",
            )}
          </div>
        </div>

        {/* Amount Paid */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount Paid
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amountPaid}
            onChange={(event) =>
              setAmountPaid(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Payment Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Payment Date
          </label>

          <input
            type="date"
            value={paymentDate}
            onChange={(event) =>
              setPaymentDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="Cash">
              Cash
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="Bank Transfer">
              Bank Transfer
            </option>

            <option value="Cheque">
              Cheque
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
            placeholder="Optional payment notes"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {/* Balance Preview */}
      {amountPaid && (
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Outstanding for this month
            </span>

            <strong
              className={
                Number(amountPaid) >=
                chit.monthlyAmount
                  ? "text-emerald-600"
                  : "text-red-600"
              }
            >
              ₹
              {Math.max(
                0,
                chit.monthlyAmount -
                  Number(amountPaid),
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            loading ||
            members.length === 0
          }
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Payment"}
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;
