import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Member } from "../../types/member";
import type { Chit } from "../../types/chit";
import type { Payment } from "../../types/payment";

interface CollectionFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

function CollectionForm({
  onSaved,
  onCancel,
}: CollectionFormProps) {
  const [chits, setChits] = useState<Chit[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [chitId, setChitId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [monthNumber, setMonthNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paymentMethod, setPaymentMethod] =
    useState("Cash");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadChits = async () => {
      const results = await db.chits
        .where("status")
        .equals("active")
        .toArray();

      setChits(results);
    };

    loadChits();
  }, []);

  useEffect(() => {
    const loadMembers = async () => {
      if (!chitId) {
        setMembers([]);
        return;
      }

      const results = await db.members
        .where("chitId")
        .equals(Number(chitId))
        .and((member) => member.status === "active")
        .toArray();

      setMembers(results);
      setMemberId("");
    };

    loadMembers();
  }, [chitId]);

  const selectedChit = chits.find(
    (chit) => chit.id === Number(chitId),
  );

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!chitId) {
      setError("Please select a chit.");
      return;
    }

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    if (!monthNumber || Number(monthNumber) <= 0) {
      setError("Please enter the month number.");
      return;
    }

    if (
      selectedChit &&
      Number(monthNumber) > selectedChit.durationMonths
    ) {
      setError(
        `This chit has only ${selectedChit.durationMonths} months.`,
      );
      return;
    }

    if (!amountPaid || Number(amountPaid) <= 0) {
      setError("Please enter the amount paid.");
      return;
    }

    if (!paymentDate) {
      setError("Please select the payment date.");
      return;
    }

    try {
      setSaving(true);

      const existingPayments = await db.payments
        .where("memberId")
        .equals(Number(memberId))
        .and(
          (payment) =>
            payment.monthNumber === Number(monthNumber),
        )
        .toArray();

      const alreadyPaid = existingPayments.reduce(
        (total, payment) => total + payment.amountPaid,
        0,
      );

      const amountDue = selectedChit?.monthlyAmount ?? 0;
      const newTotal = alreadyPaid + Number(amountPaid);

      if (newTotal > amountDue) {
        setError(
          `Payment exceeds the monthly due of ₹${amountDue.toLocaleString(
            "en-IN",
          )}. Already paid: ₹${alreadyPaid.toLocaleString(
            "en-IN",
          )}.`,
        );
        return;
      }

      const now = new Date().toISOString();

      const payment: Payment = {
        chitId: Number(chitId),
        memberId: Number(memberId),
        monthNumber: Number(monthNumber),
        amountDue,
        amountPaid: Number(amountPaid),
        paymentDate,
        paymentMethod,
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      };

      await db.payments.add(payment);

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
          Record a full or partial monthly payment.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Chit
          </label>

          <select
            value={chitId}
            onChange={(event) =>
              setChitId(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="">Select a chit</option>

            {chits.map((chit) => (
              <option key={chit.id} value={chit.id}>
                {chit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Member
          </label>

          <select
            value={memberId}
            onChange={(event) =>
              setMemberId(event.target.value)
            }
            disabled={!chitId}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-100"
          >
            <option value="">
              {chitId
                ? "Select a member"
                : "Select a chit first"}
            </option>

            {members.map((member) => (
              <option key={member.id} value={member.id}>
                #{member.memberNumber} - {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Month Number
          </label>

          <input
            type="number"
            min="1"
            value={monthNumber}
            onChange={(event) =>
              setMonthNumber(event.target.value)
            }
            placeholder="1"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Amount Paid
          </label>

          <input
            type="number"
            min="0"
            value={amountPaid}
            onChange={(event) =>
              setAmountPaid(event.target.value)
            }
            placeholder="5000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">
              Bank Transfer
            </option>
            <option value="Cheque">Cheque</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={2}
            placeholder="Optional payment notes"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {selectedChit && (
        <div className="mt-5 rounded-lg bg-violet-50 p-4 text-sm text-violet-800">
          Monthly due:{" "}
          <strong>
            ₹
            {selectedChit.monthlyAmount.toLocaleString(
              "en-IN",
            )}
          </strong>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Payment"}
        </button>
      </div>
    </form>
  );
}

export default CollectionForm;
