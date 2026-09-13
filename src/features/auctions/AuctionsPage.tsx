import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";
import type { Member } from "../../types/member";

interface AuctionFormProps {
  chit: Chit;
  cycle: Cycle;
  onSaved: () => void;
  onCancel: () => void;
}

function AuctionForm({
  chit,
  cycle,
  onSaved,
  onCancel,
}: AuctionFormProps) {
  const [members, setMembers] = useState<Member[]>([]);

  const [winnerMemberId, setWinnerMemberId] =
    useState("");

  const [auctionDate, setAuctionDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [bidAmount, setBidAmount] = useState("");
  const [discountAmount, setDiscountAmount] =
    useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);

      const results = await db.members
        .where("chitId")
        .equals(chit.id!)
        .toArray();

      const activeMembers = results.filter(
        (member) => member.status === "active",
      );

      activeMembers.sort((a, b) =>
        a.memberNumber.localeCompare(
          b.memberNumber,
          undefined,
          { numeric: true },
        ),
      );

      setMembers(activeMembers);
      setLoading(false);
    };

    loadMembers();
  }, [chit.id]);

  const bid = Number(bidAmount) || 0;
  const discount = Number(discountAmount) || 0;

  const prizeAmount = Math.max(
    0,
    chit.chitAmount - discount,
  );

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!winnerMemberId) {
      setError("Please select the auction winner.");
      return;
    }

    if (!auctionDate) {
      setError("Please select the auction date.");
      return;
    }

    if (!discountAmount || discount <= 0) {
      setError(
        "Please enter a valid discount amount.",
      );
      return;
    }

    if (discount >= chit.chitAmount) {
      setError(
        "Discount must be less than the chit amount.",
      );
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      await db.auctions.add({
        chitId: chit.id!,
        cycleId: cycle.id!,
        winnerMemberId: Number(winnerMemberId),
        auctionDate,
        bidAmount: bid,
        discountAmount: discount,
        prizeAmount,
        status: "completed",
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      });

      onSaved();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save the auction. Please try again.",
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
          Record Auction
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {chit.name} · Month {cycle.monthNumber}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Winner */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Auction Winner
          </label>

          <select
            value={winnerMemberId}
            onChange={(event) =>
              setWinnerMemberId(event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-100"
          >
            <option value="">
              {loading
                ? "Loading members..."
                : "Select winner"}
            </option>

            {members.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                #{member.memberNumber} — {member.name}
              </option>
            ))}
          </select>

          {!loading && members.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              No active members found for this chit.
            </p>
          )}
        </div>

        {/* Auction Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Auction Date
          </label>

          <input
            type="date"
            value={auctionDate}
            onChange={(event) =>
              setAuctionDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Chit Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Chit Amount
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900">
            ₹
            {chit.chitAmount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Bid Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Bid Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={bidAmount}
            onChange={(event) =>
              setBidAmount(event.target.value)
            }
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Discount / Auction Difference
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={discountAmount}
            onChange={(event) =>
              setDiscountAmount(event.target.value)
            }
            placeholder="Enter discount"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Prize Amount */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Prize Amount
          </label>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-2xl font-bold text-emerald-700">
              ₹{prizeAmount.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Chit amount minus auction discount
            </p>
          </div>
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
            placeholder="Optional auction notes"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

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
          {saving ? "Saving..." : "Save Auction"}
        </button>
      </div>
    </form>
  );
}

export default AuctionForm;
