import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Member } from "../../types/member";

interface MemberListProps {
  selectedChitId: number | null;
  onChitChange: (chitId: number | null) => void;
  refreshKey: number;
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

function MemberList({
  selectedChitId,
  onChitChange,
  refreshKey,
}: MemberListProps) {
  const [chits, setChits] = useState<Chit[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chitsLoading, setChitsLoading] = useState(true);

  useEffect(() => {
    const loadChits = async () => {
      try {
        setChitsLoading(true);

        const results = await db.chits
          .where("status")
          .equals("active")
          .toArray();

        setChits(results);

        if (
          results.length > 0 &&
          selectedChitId === null
        ) {
          onChitChange(results[0].id!);
        }

        if (results.length === 0) {
          onChitChange(null);
        }
      } catch (error) {
        console.error(
          "Failed to load chits:",
          error,
        );
        setChits([]);
      } finally {
        setChitsLoading(false);
      }
    };

    loadChits();
  }, [selectedChitId, onChitChange]);

  useEffect(() => {
    const loadMembers = async () => {
      if (selectedChitId === null) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const results = await db.members
          .where("chitId")
          .equals(selectedChitId)
          .toArray();

        results.sort((a, b) =>
          a.memberNumber.localeCompare(
            b.memberNumber,
            undefined,
            { numeric: true },
          ),
        );

        setMembers(results);
      } catch (error) {
        console.error(
          "Failed to load members:",
          error,
        );
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [selectedChitId, refreshKey]);

  const filteredMembers = members.filter(
    (member) => {
      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        member.name
          .toLowerCase()
          .includes(searchText) ||
        member.memberNumber
          .toLowerCase()
          .includes(searchText) ||
        member.phone
          .toLowerCase()
          .includes(searchText)
      );
    },
  );

  const activeCount = members.filter(
    (member) => member.status === "active",
  ).length;

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(220px, 1fr) minmax(260px, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label className="form-label">
            Chit Group
          </label>

          <select
            value={selectedChitId ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              onChitChange(
                value ? Number(value) : null,
              );

              setSearch("");
            }}
            disabled={chitsLoading}
            className="form-input"
          >
            <option value="">
              {chitsLoading
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
            Search Members
          </label>

          <div style={{ position: "relative" }}>
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, number or phone..."
              disabled={selectedChitId === null}
              className="form-input"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: 0,
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedChitId !== null && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div className="stat-card">
            <div className="stat-label">
              Total Members
            </div>

            <div className="stat-value">
              {members.length}
            </div>

            <div className="stat-description">
              Registered in this chit
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Active Members
            </div>

            <div
              className="stat-value"
              style={{ color: "#059669" }}
            >
              {activeCount}
            </div>

            <div className="stat-description">
              Currently participating
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Search Results
            </div>

            <div
              className="stat-value"
              style={{ color: "#7c3aed" }}
            >
              {filteredMembers.length}
            </div>

            <div className="stat-description">
              Members currently shown
            </div>
          </div>
        </div>
      )}

      {/* No active chits */}
      {chits.length === 0 &&
      !chitsLoading ? (
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
            ♙
          </div>

          <div className="empty-state-title">
            No active chits
          </div>

          <div className="empty-state-text">
            Create an active chit before adding
            members.
          </div>
        </div>
      ) : selectedChitId === null ? (
        <div className="empty-state">
          <div className="empty-state-title">
            Select a chit
          </div>

          <div className="empty-state-text">
            Select a chit group above to view its
            members.
          </div>
        </div>
      ) : loading ? (
        <div className="empty-state">
          <div className="empty-state-title">
            Loading members...
          </div>

          <div className="empty-state-text">
            Loading your local member records.
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="empty-state">
          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 14px",
              borderRadius: "12px",
              background: "#f1f5f9",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            {members.length === 0 ? "+" : "?"}
          </div>

          <div className="empty-state-title">
            {members.length === 0
              ? "No members yet"
              : "No members found"}
          </div>

          <div className="empty-state-text">
            {members.length === 0
              ? "Use Add Member to register the first member for this chit."
              : "Try a different name, member number or phone number."}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map(
                (member) => (
                  <tr key={member.id}>
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
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "#dbeafe",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {member.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: 650,
                              color: "#0f172a",
                            }}
                          >
                            {member.name}
                          </div>

                          <div
                            style={{
                              marginTop: "2px",
                              color: "#64748b",
                              fontSize: "12px",
                            }}
                          >
                            Member #
                            {member.memberNumber}
                          </div>

                          {member.address && (
                            <div
                              style={{
                                marginTop: "3px",
                                maxWidth: "300px",
                                overflow: "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                                color: "#94a3b8",
                                fontSize: "11px",
                              }}
                            >
                              {member.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      {member.phone || "—"}
                    </td>

                    <td>
                      {formatDate(
                        member.joiningDate,
                      )}
                    </td>

                    <td>
                      {member.status ===
                      "active" ? (
                        <span className="badge badge-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-neutral">
                          {member.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MemberList;
