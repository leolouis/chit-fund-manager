import { useState } from "react";

import MemberForm from "./MemberForm";
import MemberList from "./MemberList";

function MembersPage() {
  const [selectedChitId, setSelectedChitId] =
    useState<number | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setRefreshKey((value) => value + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
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
            Members
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Manage members belonging to your chit groups.
          </p>
        </div>
      </div>

      {/* Member management card */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h4 className="card-title">
              Member Directory
            </h4>

            <p className="card-subtitle">
              Select a chit group to view and manage its
              members.
            </p>
          </div>

          {selectedChitId !== null &&
            !showForm && (
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

                Add Member
              </button>
            )}
        </div>

        <MemberList
          selectedChitId={selectedChitId}
          onChitChange={setSelectedChitId}
          refreshKey={refreshKey}
        />
      </div>

      {/* Member form */}
      {selectedChitId !== null &&
        showForm && (
          <div style={{ marginTop: "20px" }}>
            <MemberForm
              chitId={selectedChitId}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </div>
        )}
    </div>
  );
}

export default MembersPage;
