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
      try {
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
      } catch (err) {
        console.error(
          "Unable to load members:",
          err,
        );
        setError(
          "Unable to load members. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [chit.id]);

  const selectedMember = members.find(
    (member) =>
      member.id === Number(memberId),
  );

  const paidAmount = Number(amountPaid) || 0;

  const balance = Math.max(
    0,
    chit.monthlyAmount - paidAmount,
  );

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    if (!amountPaid || paidAmount <= 0) {
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

      /*
       * Prevent duplicate payment records for the
       * same member and monthly cycle.
       */
      const existingPayments =
        await db.payments
          .where("cycleId")
          .equals(cycle.id!)
          .toArray();

      const alreadyPaid =
        existingPayments.find(
          (payment) =>
            payment.memberId ===
            Number(memberId),
        );

      if (alreadyPaid) {
        setError(
          `${selectedMember?.name ?? "This member"} already has a payment recorded for Month ${cycle.monthNumber}.`,
        );
        return;
      }

      const now = new Date().toISOString();

      await db.payments.add({
        chitId: chit.id!,
        memberId: Number(memberId),
        cycleId: cycle.id!,
        monthNumber: cycle.monthNumber,
        amountDue: chit.monthlyAmount,
        amountPaid: paidAmount,
        paymentDate,
        paymentMethod,
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      });

      onSaved();
    } catch (err) {
      console.error(
        "Unable to save payment:",
        err,
      );

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
      className="card"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div>
          <h3 className="card-title">
            Record Payment
          </h3>

          <p className="card-subtitle">
            {chit.name}
            {" · "}
            Month {cycle.monthNumber}
          </p>
        </div>

        <span className="badge badge-info">
          Month {cycle.monthNumber}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          className="alert alert-danger"
          style={{ marginBottom: "18px" }}
        >
          {error}
        </div>
      )}

      {/* Form fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "18px",
        }}
      >
        {/* Member */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">
            Member
          </label>

          <select
            value={memberId}
            onChange={(event) =>
              setMemberId(event.target.value)
            }
            disabled={loading}
            className="form-input"
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
              <div
                style={{
                  marginTop: "7px",
                  color: "#d97706",
                  fontSize: "12px",
                }}
              >
                No active members found for this
                chit. Add a member before recording
                a payment.
              </div>
            )}
        </div>

        {/* Amount Due */}
        <div>
          <label className="form-label">
            Amount Due
          </label>

          <div
            style={{
              minHeight: "42px",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#f8fafc",
              fontWeight: 650,
              color: "#0f172a",
            }}
          >
            ₹
            {chit.monthlyAmount.toLocaleString(
              "en-IN",
            )}
          </div>
        </div>

        {/* Amount Paid */}
        <div>
          <label className="form-label">
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
            className="form-input"
          />
        </div>

        {/* Payment Date */}
        <div>
          <label className="form-label">
            Payment Date
          </label>

          <input
            type="date"
            value={paymentDate}
            onChange={(event) =>
              setPaymentDate(event.target.value)
            }
            className="form-input"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="form-label">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(
                event.target.value,
              )
            }
            className="form-input"
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
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
            placeholder="Optional payment notes"
            className="form-input"
            style={{
              resize: "vertical",
              minHeight: "80px",
            }}
          />
        </div>
      </div>

      {/* Payment preview */}
      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          borderRadius: "10px",
          background:
            balance === 0
              ? "#ecfdf5"
              : "#fff7ed",
          border:
            balance === 0
              ? "1px solid #a7f3d0"
              : "1px solid #fed7aa",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          <div>
            <div className="stat-label">
              Amount Due
            </div>

            <div
              style={{
                marginTop: "4px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ₹
              {chit.monthlyAmount.toLocaleString(
                "en-IN",
              )}
            </div>
          </div>

          <div>
            <div className="stat-label">
              Amount Paid
            </div>

            <div
              style={{
                marginTop: "4px",
                fontWeight: 700,
                color: "#059669",
              }}
            >
              ₹
              {paidAmount.toLocaleString(
                "en-IN",
              )}
            </div>
          </div>

          <div>
            <div className="stat-label">
              Balance
            </div>

            <div
              style={{
                marginTop: "4px",
                fontWeight: 700,
                color:
                  balance === 0
                    ? "#059669"
                    : "#d97706",
              }}
            >
              ₹
              {balance.toLocaleString(
                "en-IN",
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: "22px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="btn btn-secondary"
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
          className="btn btn-primary"
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
