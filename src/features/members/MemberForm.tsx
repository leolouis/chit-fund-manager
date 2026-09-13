import { useEffect, useState } from "react";

import { db } from "../../db/database";

interface MemberFormProps {
  chitId: number;
  onSaved: () => void;
  onCancel: () => void;
}

function MemberForm({
  chitId,
  onSaved,
  onCancel,
}: MemberFormProps) {
  const [memberNumber, setMemberNumber] =
    useState("");

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [joiningDate, setJoiningDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0],
    );

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadNextMemberNumber =
      async () => {
        const members = await db.members
          .where("chitId")
          .equals(chitId)
          .toArray();

        const numbers = members
          .map((member) =>
            Number(member.memberNumber),
          )
          .filter((number) =>
            Number.isFinite(number),
          );

        const nextNumber =
          numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;

        setMemberNumber(
          String(nextNumber),
        );
      };

    loadNextMemberNumber();
  }, [chitId]);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter the member name.");
      return;
    }

    if (!memberNumber.trim()) {
      setError(
        "Please enter a member number.",
      );
      return;
    }

    try {
      setSaving(true);

      const existing =
        await db.members
          .where("chitId")
          .equals(chitId)
          .toArray();

      const duplicate =
        existing.some(
          (member) =>
            member.memberNumber.trim() ===
            memberNumber.trim(),
        );

      if (duplicate) {
        setError(
          "That member number is already being used in this chit.",
        );
        return;
      }

      await db.members.add({
        chitId,
        memberNumber:
          memberNumber.trim(),
        name: trimmedName,
        phone: phone.trim(),
        address: address.trim(),
        joiningDate,
        status: "active",
        notes: notes.trim(),
      });

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
          Add a new member to this chit.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Member Number
          </label>

          <input
            type="text"
            value={memberNumber}
            onChange={(event) =>
              setMemberNumber(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="1"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="Member name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Joining Date
          </label>

          <input
            type="date"
            value={joiningDate}
            onChange={(event) =>
              setJoiningDate(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(
                event.target.value,
              )
            }
            rows={2}
            placeholder="Optional address"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
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
          disabled={saving}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Member"}
        </button>
      </div>
    </form>
  );
}

export default MemberForm;
