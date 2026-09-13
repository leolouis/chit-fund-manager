import { useState } from "react";

import { db } from "../../db/database";
import { generateCycles } from "./generateCycles";
import type { Chit } from "../../types/chit";

interface ChitFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

function ChitForm({
  onSaved,
  onCancel,
}: ChitFormProps) {
  const [name, setName] = useState("");
  const [chitAmount, setChitAmount] = useState("");
  const [monthlyAmount, setMonthlyAmount] =
    useState("");
  const [memberCount, setMemberCount] =
    useState("");
  const [durationMonths, setDurationMonths] =
    useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [commission, setCommission] =
    useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a chit name.");
      return;
    }

    if (
      !chitAmount ||
      Number(chitAmount) <= 0
    ) {
      setError("Please enter a valid chit amount.");
      return;
    }

    if (
      !monthlyAmount ||
      Number(monthlyAmount) <= 0
    ) {
      setError(
        "Please enter a valid monthly contribution.",
      );
      return;
    }

    if (
      !memberCount ||
      Number(memberCount) <= 0
    ) {
      setError("Please enter the number of members.");
      return;
    }

    if (
      !durationMonths ||
      Number(durationMonths) <= 0
    ) {
      setError("Please enter the chit duration.");
      return;
    }

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      const chit: Chit = {
        name: name.trim(),

        chitAmount: Number(chitAmount),

        monthlyAmount: Number(monthlyAmount),

        memberCount: Number(memberCount),

        durationMonths: Number(durationMonths),

        startDate,

        endDate: calculateEndDate(
          startDate,
          Number(durationMonths),
        ),

        commission: Number(commission) || 0,

        status: "active",

        notes: notes.trim(),

        createdAt: now,

        updatedAt: now,
      };

      const id = await db.chits.add(chit);

      /*
       * Automatically create all monthly cycles
       * for the newly created chit.
       */
      await generateCycles(Number(id));

      onSaved();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save the chit. Please try again.",
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
          Create Chit
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Enter the basic details for your chit group.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Chit Name */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Chit Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Example: Family Chit 2026"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Chit Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Chit Amount
          </label>

          <input
            type="number"
            min="0"
            value={chitAmount}
            onChange={(event) =>
              setChitAmount(event.target.value)
            }
            placeholder="100000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Monthly Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Monthly Contribution
          </label>

          <input
            type="number"
            min="0"
            value={monthlyAmount}
            onChange={(event) =>
              setMonthlyAmount(event.target.value)
            }
            placeholder="5000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Member Count */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Number of Members
          </label>

          <input
            type="number"
            min="1"
            value={memberCount}
            onChange={(event) =>
              setMemberCount(event.target.value)
            }
            placeholder="20"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Duration (Months)
          </label>

          <input
            type="number"
            min="1"
            value={durationMonths}
            onChange={(event) =>
              setDurationMonths(event.target.value)
            }
            placeholder="20"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Commission */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Host Commission
          </label>

          <input
            type="number"
            min="0"
            value={commission}
            onChange={(event) =>
              setCommission(event.target.value)
            }
            placeholder="0"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <p className="mt-1 text-xs text-slate-500">
            Leave as 0 if you don't want to configure
            it yet.
          </p>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
            placeholder="Optional notes about this chit"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {/* Summary */}
      {monthlyAmount &&
        memberCount &&
        durationMonths && (
          <div className="mt-6 rounded-lg bg-violet-50 p-4">
            <p className="text-sm font-medium text-violet-900">
              Chit Summary
            </p>

            <div className="mt-2 grid gap-2 text-sm text-violet-800 sm:grid-cols-3">
              <div>
                Monthly:{" "}
                <strong>
                  ₹
                  {Number(
                    monthlyAmount,
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                Members:{" "}
                <strong>
                  {memberCount}
                </strong>
              </div>

              <div>
                Duration:{" "}
                <strong>
                  {durationMonths} months
                </strong>
              </div>
            </div>
          </div>
        )}

      {/* Actions */}
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
          {saving ? "Creating..." : "Create Chit"}
        </button>
      </div>
    </form>
  );
}

function calculateEndDate(
  startDate: string,
  durationMonths: number,
) {
  const date = new Date(
    `${startDate}T00:00:00`,
  );

  date.setMonth(
    date.getMonth() + durationMonths - 1,
  );

  return date.toISOString().split("T")[0];
}

export default ChitForm;
