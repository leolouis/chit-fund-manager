import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";

interface ChitListProps {
  refreshKey: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ChitList({ refreshKey }: ChitListProps) {
  const [chits, setChits] = useState<Chit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChits = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await db.chits.toArray();

        results.sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          return dateB - dateA;
        });

        setChits(results);
      } catch (err) {
        console.error("Failed to load chits:", err);
        setError("Unable to load chits.");
      } finally {
        setLoading(false);
      }
    };

    loadChits();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">
          Loading chits...
        </div>

        <div className="empty-state-text">
          Please wait while your local data is loaded.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  if (chits.length === 0) {
    return (
      <div className="empty-state">
        <div
          style={{
            width: "52px",
            height: "52px",
            margin: "0 auto 14px",
            borderRadius: "12px",
            background: "#ede9fe",
            color: "#7c3aed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          ₹
        </div>

        <div className="empty-state-title">
          No chits yet
        </div>

        <div className="empty-state-text">
          Create your first chit group to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Chit</th>
            <th>Monthly</th>
            <th>Members</th>
            <th>Duration</th>
            <th>Start Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {chits.map((chit) => (
            <tr key={chit.id}>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "9px",
                      background: "#ede9fe",
                      color: "#7c3aed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {chit.name
                      ? chit.name.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 650,
                        color: "#0f172a",
                      }}
                    >
                      {chit.name}
                    </div>

                    <div
                      style={{
                        marginTop: "2px",
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      {formatCurrency(chit.chitAmount)}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <strong
                  style={{
                    color: "#334155",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(chit.monthlyAmount)}
                </strong>
              </td>

              <td>
                <span
                  style={{
                    color: "#334155",
                    fontWeight: 600,
                  }}
                >
                  {chit.memberCount}
                </span>
              </td>

              <td>
                {chit.durationMonths} months
              </td>

              <td>
                {formatDate(chit.startDate)}
              </td>

              <td>
                <span
                  className={
                    chit.status === "active"
                      ? "badge badge-success"
                      : "badge badge-neutral"
                  }
                >
                  {chit.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChitList;
