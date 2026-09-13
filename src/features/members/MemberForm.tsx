import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Member } from "../../types/member";

interface MemberFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

function MemberForm({
  onSaved,
  onCancel,
}: MemberFormProps) {
  const [chits, setChits] = useState<Chit[]>([]);

  const [chitId, setChitId] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
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

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!chitId) {
      setError("Please select a chit.");
      return;
    }

    if (!memberNumber || Number(memberNumber) <= 0) {
      setError("Please enter a member number.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter the member name.");
      return;
    }

    if (!joiningDate) {
      setError("Please select the joining date.");
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      const member: Member = {
        chitId: Number(chitId),

        memberNumber: Number(memberNumber),

        name: name.trim(),

        phone: phone.trim(),

        address: address.trim(),

        joiningDate,

        status: "active",

        notes: notes.trim(),

        createdAt: now,
        updatedAt: now,
      };

      await db.members.add(member);

      onSaved();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save the member. Please try again.",
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
          Add Member
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add a member to one of your active chits.
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
            <option value="">
              Select a chit
            </option>

            {chits.map((chit) => (
              <option
                key={chit.id}
                value={chit.id}
              >
                {chit.name}
              </option>
            ))}
          </select>

          {chits.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              Create an active chit first.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Member Number
          </label>

          <input
            type="number"
            min="1"
            value={memberNumber}
            onChange={(event) =>
              setMemberNumber(event.target.value)
            }
            placeholder="1"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Member name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="Phone number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Joining Date
          </label>

          <input
            type="date"
            value={joiningDate}
            onChange={(event) =>
              setJoiningDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            rows={2}
            placeholder="Member address"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
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
            placeholder="Optional notes"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

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
          disabled={saving || chits.length === 0}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Member"}
        </button>
      </div>
    </form>
  );
}

export default MemberForm;
