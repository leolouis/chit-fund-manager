import { useEffect, useState } from "react";

import { db } from "../../db/database";
import ChitForm from "./ChitForm";
import ChitList from "./ChitList";

function ChitsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [totalChits, setTotalChits] = useState(0);
  const [activeChits, setActiveChits] = useState(0);
  const [completedChits, setCompletedChits] =
    useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const chits = await db.chits.toArray();

        setTotalChits(chits.length);

        setActiveChits(
          chits.filter(
            (chit) =>
              String(chit.status).toLowerCase() ===
              "active",
          ).length,
        );

        setCompletedChits(
          chits.filter(
            (chit) =>
              String(chit.status).toLowerCase() ===
              "completed",
          ).length,
        );
      } catch (error) {
        console.error(
          "Failed to load chit summary:",
          error,
        );
      }
    };

    loadSummary();
  }, [refreshKey]);

  const handleSaved = () => {
    setShowForm(false);
    setRefreshKey((value) => value + 1);
  };

  if (showForm) {
    return (
      <div className="page-content">
        <ChitForm
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Page header */}
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
            Chits
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Create and manage your chit groups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
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

          Create Chit
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">
            Total Chits
          </div>

          <div className="stat-value">
            {totalChits}
          </div>

          <div className="stat-description">
            All registered chit groups
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Active Chits
          </div>

          <div className="stat-value">
            {activeChits}
          </div>

          <div className="stat-description">
            Currently running groups
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Completed
          </div>

          <div className="stat-value">
            {completedChits}
          </div>

          <div className="stat-description">
            Successfully completed groups
          </div>
        </div>
      </div>

      {/* Chit list */}
      <div className="card">
        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <h4 className="card-title">
            Chit Groups
          </h4>

          <p className="card-subtitle">
            Manage your registered chit groups and
            their details.
          </p>
        </div>

        <ChitList refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default ChitsPage;
