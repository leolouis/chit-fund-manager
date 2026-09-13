import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";

interface CycleListProps {
  chitId: number;
  refreshKey: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function CycleList({
  chitId,
  refreshKey,
}: CycleListProps) {
  const [chit, setChit] =
    useState<Chit | undefined>();

  const [cycles, setCycles] =
    useState<Cycle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const loadCycles = async () => {
    setLoading(true);

    try {
      const selectedChit =
        await db.chits.get(chitId);

      const selectedCycles =
        await db.cycles
          .where("chitId")
          .equals(chitId)
          .sortBy("monthNumber");

      setChit(selectedChit);
      setCycles(selectedCycles);
    } catch (error) {
      console.error(
        "Failed to load cycles:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, [chitId, refreshKey]);

  const generateCycles = async () => {
    if (!chit) return;

    setGenerating(true);
    setMessage("");

    try {
      const existingCycles =
        await db.cycles
          .where("chitId")
          .equals(chitId)
          .toArray();

      if (existingCycles.length > 0) {
        setMessage(
          "Cycles already exist for this chit.",
        );
        return;
      }

      const startDate = new Date(
        `${chit.startDate}T00:00:00`,
      );

      const newCycles: Cycle[] = [];

      for (
        let month = 1;
        month <= chit.durationMonths;
        month++
      ) {
        const dueDate = new Date(
          startDate,
        );

        dueDate.setMonth(
          startDate.getMonth() + month - 1,
        );

        newCycles.push({
          chitId,
          monthNumber: month,
          dueDate: formatDate(dueDate),
          status:
            month === 1
              ? "open"
              : "upcoming",
        });
      }

      await db.cycles.bulkAdd(newCycles);

      await loadCycles();

      setMessage(
        `${newCycles.length} monthly cycles created successfully.`,
      );
    } catch (error) {
      console.error(
        "Failed to generate cycles:",
        error,
      );

      setMessage(
        "Unable to generate cycles. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">
          Loading monthly cycles...
        </div>

        <div className="empty-state-text">
          Reading your local cycle records.
        </div>
      </div>
    );
  }

  if (!chit) {
    return (
      <div
        className="alert alert-danger"
        style={{ marginTop: "20px" }}
      >
        Chit not found.
      </div>
    );
  }

  return (
    <div>
      {/* Chit summary */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {chit.name}
              </h3>

              <span className="badge badge-success">
                Active
              </span>
            </div>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Monthly cycle schedule
            </p>
          </div>

          {cycles.length === 0 && (
            <button
              type="button"
              onClick={generateCycles}
              disabled={generating}
              className="btn btn-primary"
            >
              {generating
                ? "Generating..."
                : "Generate Cycles"}
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginTop: "20px",
          }}
        >
          <div className="mini-stat">
            <div className="stat-label">
              Monthly Contribution
            </div>

            <div
              style={{
                marginTop: "5px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {formatCurrency(
                chit.monthlyAmount,
              )}
            </div>
          </div>

          <div className="mini-stat">
            <div className="stat-label">
              Duration
            </div>

            <div
              style={{
                marginTop: "5px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {chit.durationMonths} months
            </div>
          </div>

          <div className="mini-stat">
            <div className="stat-label">
              Members
            </div>

            <div
              style={{
                marginTop: "5px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {chit.memberCount}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className="alert alert-info"
          style={{ marginTop: "16px" }}
        >
          {message}
        </div>
      )}

      {/* Empty state */}
      {cycles.length === 0 ? (
        <div
          className="empty-state"
          style={{ marginTop: "20px" }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              margin: "0 auto 14px",
              borderRadius: "14px",
              background: "#ede9fe",
              color: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 750,
            }}
          >
            {chit.durationMonths}
          </div>

          <div className="empty-state-title">
            No cycles found
          </div>

          <div className="empty-state-text">
            Generate {chit.durationMonths} monthly
            cycles for this chit to start managing
            collections.
          </div>
        </div>
      ) : (
        <>
          {/* Cycle summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "14px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="stat-card">
              <div className="stat-label">
                Total Cycles
              </div>

              <div className="stat-value">
                {cycles.length}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Open
              </div>

              <div
                className="stat-value"
                style={{ color: "#2563eb" }}
              >
                {
                  cycles.filter(
                    (cycle) =>
                      cycle.status === "open",
                  ).length
                }
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Upcoming
              </div>

              <div
                className="stat-value"
                style={{ color: "#64748b" }}
              >
                {
                  cycles.filter(
                    (cycle) =>
                      cycle.status ===
                      "upcoming",
                  ).length
                }
              </div>
            </div>
          </div>

          {/* Cycle table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cycle</th>
                  <th>Due Date</th>
                  <th>Monthly Due</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {cycles.map((cycle) => (
                  <tr key={cycle.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 650,
                          color: "#0f172a",
                        }}
                      >
                        Month{" "}
                        {cycle.monthNumber}
                      </div>

                      {cycle.monthNumber ===
                        1 && (
                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "11px",
                            color: "#64748b",
                          }}
                        >
                          First collection
                        </div>
                      )}
                    </td>

                    <td>
                      {cycle.dueDate}
                    </td>

                    <td>
                      {formatCurrency(
                        chit.monthlyAmount,
                      )}
                    </td>

                    <td>
                      {cycle.status ===
                        "completed" && (
                        <span className="badge badge-success">
                          Completed
                        </span>
                      )}

                      {cycle.status === "open" && (
                        <span className="badge badge-info">
                          Open
                        </span>
                      )}

                      {cycle.status ===
                        "upcoming" && (
                        <span className="badge badge-neutral">
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default CycleList;
