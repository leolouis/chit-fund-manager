const stats = [
  {
    label: "Active Chits",
    value: "0",
    description: "Currently running",
    icon: "◫",
    color: "#7c3aed",
    background: "#ede9fe",
  },
  {
    label: "Total Members",
    value: "0",
    description: "Across all active chits",
    icon: "♙",
    color: "#2563eb",
    background: "#dbeafe",
  },
  {
    label: "Collected",
    value: "₹0",
    description: "This month's collections",
    icon: "₹",
    color: "#059669",
    background: "#d1fae5",
  },
  {
    label: "Outstanding",
    value: "₹0",
    description: "Pending collection",
    icon: "!",
    color: "#d97706",
    background: "#fef3c7",
  },
];

function Dashboard() {
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
            Dashboard
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Overview of your chit fund operations.
          </p>
        </div>

        <div
          style={{
            padding: "7px 11px",
            borderRadius: "8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          All figures are current
        </div>
      </div>

      {/* Statistics */}
      <div className="dashboard-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="stat-label">
                  {stat.label}
                </div>

                <div className="stat-value">
                  {stat.value}
                </div>

                <div className="stat-description">
                  {stat.description}
                </div>
              </div>

              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: stat.background,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 750,
                }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collection overview */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "20px",
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h4 className="card-title">
                Collection Overview
              </h4>

              <p className="card-subtitle">
                Monthly collection performance
              </p>
            </div>

            <span className="badge badge-neutral">
              This month
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#f8fafc",
              }}
            >
              <div className="stat-label">
                Expected
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                ₹0
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#ecfdf5",
              }}
            >
              <div
                style={{
                  color: "#047857",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Collected
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#065f46",
                }}
              >
                ₹0
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#fffbeb",
              }}
            >
              <div
                style={{
                  color: "#92400e",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Pending
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#78350f",
                }}
              >
                ₹0
              </div>
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <span>Collection progress</span>
              <span>0%</span>
            </div>

            <div
              style={{
                height: "8px",
                borderRadius: "999px",
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "0%",
                  height: "100%",
                  borderRadius: "999px",
                  background: "#7c3aed",
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick status */}
        <div className="card">
          <h4 className="card-title">
            Quick Status
          </h4>

          <p className="card-subtitle">
            Items requiring attention
          </p>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "9px",
                background: "#f8fafc",
              }}
            >
              <span
                style={{
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Pending payments
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "14px",
                }}
              >
                0
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "9px",
                background: "#f8fafc",
              }}
            >
              <span
                style={{
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Upcoming auctions
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "14px",
                }}
              >
                0
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "9px",
                background: "#f8fafc",
              }}
            >
              <span
                style={{
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Active groups
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "14px",
                }}
              >
                0
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 className="card-title">
                Pending Payments
              </h4>

              <p className="card-subtitle">
                Members with outstanding dues
              </p>
            </div>

            <span className="badge badge-warning">
              0 pending
            </span>
          </div>

          <div className="empty-state">
            <div
              style={{
                fontSize: "30px",
                marginBottom: "8px",
                opacity: 0.5,
              }}
            >
              ✓
            </div>

            <div className="empty-state-title">
              No pending payments
            </div>

            <div className="empty-state-text">
              All collection records will appear here.
            </div>
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 className="card-title">
                Upcoming Auctions
              </h4>

              <p className="card-subtitle">
                Your next scheduled auctions
              </p>
            </div>

            <span className="badge badge-neutral">
              0 scheduled
            </span>
          </div>

          <div className="empty-state">
            <div
              style={{
                fontSize: "30px",
                marginBottom: "8px",
                opacity: 0.5,
              }}
            >
              ◆
            </div>

            <div className="empty-state-title">
              No upcoming auctions
            </div>

            <div className="empty-state-text">
              Scheduled auctions will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
