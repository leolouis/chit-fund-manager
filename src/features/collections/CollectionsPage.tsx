import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Cycle } from "../../types/cycle";

import PaymentForm from "./PaymentForm";
import PaymentList from "./PaymentList";

function CollectionsPage() {
  const [chits, setChits] = useState<Chit[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);

  const [selectedChitId, setSelectedChitId] =
    useState("");

  const [selectedCycleId, setSelectedCycleId] =
    useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [loadingChits, setLoadingChits] =
    useState(true);

  const [loadingCycles, setLoadingCycles] =
    useState(false);

  useEffect(() => {
    const loadChits = async () => {
      try {
        setLoadingChits(true);

        const results = await db.chits
          .where("status")
          .equals("active")
          .toArray();

        setChits(results);

        if (
          results.length > 0 &&
          !selectedChitId
        ) {
          setSelectedChitId(
            String(results[0].id),
          );
        }

        if (results.length === 0) {
          setSelectedChitId("");
        }
      } catch (error) {
        console.error(
          "Failed to load chits:",
          error,
        );
        setChits([]);
      } finally {
        setLoadingChits(false);
      }
    };

    loadChits();
  }, [selectedChitId]);

  useEffect(() => {
    const loadCycles = async () => {
      if (!selectedChitId) {
        setCycles([]);
        setSelectedCycleId("");
        return;
      }

      try {
        setLoadingCycles(true);

        const results = await db.cycles
          .where("chitId")
          .equals(Number(selectedChitId))
          .sortBy("monthNumber");

        setCycles(results);

        if (results.length > 0) {
          const openCycle = results.find(
            (cycle) => cycle.status === "open",
          );

          setSelectedCycleId(
            String(
              (openCycle ?? results[0]).id,
            ),
          );
        } else {
          setSelectedCycleId("");
        }
      } catch (error) {
        console.error(
          "Failed to load cycles:",
          error,
        );
        setCycles([]);
        setSelectedCycleId("");
      } finally {
        setLoadingCycles(false);
      }
    };

    loadCycles();
  }, [selectedChitId, refreshKey]);

  const selectedChit = chits.find(
    (chit) =>
      chit.id === Number(selectedChitId),
  );

  const selectedCycle = cycles.find(
    (cycle) =>
      cycle.id === Number(selectedCycleId),
  );

  const handlePaymentSaved = () => {
    setShowPaymentForm(false);
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="page-content">
      {/* Page heading */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 750,
              color: "#0f172a",
            }}
          >
            Collections
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Record and manage monthly member
            payments.
          </p>
        </div>
      </div>

      {/* Selection */}
      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label className="form-label">
              Chit Group
            </label>

            <select
              value={selectedChitId}
              onChange={(event) => {
                setSelectedChitId(
                  event.target.value,
                );
                setShowPaymentForm(false);
              }}
              disabled={loadingChits}
              className="form-input"
            >
              <option value="">
                {loadingChits
                  ? "Loading chits..."
                  : "Select a chit"}
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
          </div>

          <div>
            <label className="form-label">
              Monthly Cycle
            </label>

            <select
              value={selectedCycleId}
              onChange={(event) => {
                setSelectedCycleId(
                  event.target.value,
                );
                setShowPaymentForm(false);
              }}
              disabled={
                cycles.length === 0 ||
                loadingCycles
              }
              className="form-input"
            >
              {loadingCycles ? (
                <option value="">
                  Loading cycles...
                </option>
              ) : cycles.length === 0 ? (
                <option value="">
                  No cycles available
                </option>
              ) : (
                cycles.map((cycle) => (
                  <option
                    key={cycle.id}
                    value={cycle.id}
                  >
                    Month {cycle.monthNumber} —{" "}
                    {cycle.dueDate}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Selected cycle information */}
        {selectedChit && selectedCycle && (
          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #f5f3ff, #faf5ff)",
              border: "1px solid #ddd6fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#5b21b6",
                }}
              >
                {selectedChit.name}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "13px",
                  color: "#7c3aed",
                }}
              >
                Month {selectedCycle.monthNumber}
                {" · "}
                Due {selectedCycle.dueDate}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7c3aed",
                  fontWeight: 600,
                }}
              >
                MONTHLY CONTRIBUTION
              </div>

              <div
                style={{
                  marginTop: "3px",
                  fontSize: "20px",
                  fontWeight: 750,
                  color: "#4c1d95",
                }}
              >
                ₹
                {selectedChit.monthlyAmount.toLocaleString(
                  "en-IN",
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No cycles */}
      {selectedChit &&
        !loadingCycles &&
        cycles.length === 0 && (
          <div
            className="alert alert-warning"
            style={{ marginTop: "20px" }}
          >
            <div>
              <strong>
                No monthly cycles found.
              </strong>

              <div
                style={{
                  marginTop: "3px",
                  fontSize: "13px",
                }}
              >
                Create the monthly cycles for this
                chit before recording payments.
              </div>
            </div>
          </div>
        )}

      {/* Payment form */}
      {showPaymentForm &&
        selectedChit &&
        selectedCycle && (
          <div style={{ marginTop: "20px" }}>
            <PaymentForm
              chit={selectedChit}
              cycle={selectedCycle}
              onSaved={handlePaymentSaved}
              onCancel={() =>
                setShowPaymentForm(false)
              }
            />
          </div>
        )}

      {/* Payment actions */}
      {!showPaymentForm &&
        selectedChit &&
        selectedCycle && (
          <div
            style={{
              marginTop: "20px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setShowPaymentForm(true)
              }
              className="btn btn-primary"
            >
              <span
                style={{
                  fontSize: "17px",
                  lineHeight: 1,
                }}
              >
                +
              </span>

              Record Payment
            </button>
          </div>
        )}

      {/* Payment list */}
      {selectedChit && selectedCycle && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <div className="card">
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <h4 className="card-title">
                Payment Records
              </h4>

              <p className="card-subtitle">
                Payments recorded for Month{" "}
                {selectedCycle.monthNumber}.
              </p>
            </div>

            <PaymentList
              chit={selectedChit}
              cycle={selectedCycle}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      )}

      {/* No chits */}
      {!loadingChits &&
        chits.length === 0 && (
          <div
            className="empty-state"
            style={{ marginTop: "20px" }}
          >
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
              No active chits
            </div>

            <div className="empty-state-text">
              Create an active chit before
              recording collections.
            </div>
          </div>
        )}
    </div>
  );
}

export default CollectionsPage;
