import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Chit } from "../../types/chit";
import type { Member } from "../../types/member";

interface MemberListProps {
  selectedChitId: number | null;
  onChitChange: (
    chitId: number | null,
  ) => void;
  refreshKey: number;
}

function MemberList({
  selectedChitId,
  onChitChange,
  refreshKey,
}: MemberListProps) {
  const [chits, setChits] = useState<Chit[]>(
    [],
  );

  const [members, setMembers] = useState<
    Member[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadChits = async () => {
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
      setLoading(false);
    };

    loadMembers();
  }, [selectedChitId, refreshKey]);

  const filteredMembers =
    members.filter((member) => {
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
    });

  const activeCount = members.filter(
    (member) =>
      member.status === "active",
  ).length;

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Chit
            </label>

            <select
              value={
                selectedChitId ??
                ""
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                onChitChange(
                  value
                    ? Number(value)
                    : null,
                );

                setSearch("");
              }}
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Member
            </label>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Name, number or phone"
              disabled={
                selectedChitId === null
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedChitId !== null && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Members
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {members.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Showing
            </p>

            <p className="mt-1 text-2xl font-bold text-violet-600">
              {filteredMembers.length}
            </p>
          </div>
        </div>
      )}

      {/* Members */}
      {selectedChitId === null ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-900">
            Select a chit
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Select a chit above to view its
            members.
          </p>
        </div>
      ) : loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading members...
          </p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-900">
            {members.length === 0
              ? "No members yet"
              : "No members found"}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {members.length === 0
              ? "Use the Add Member button below to add the first member."
              : "Try a different search."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    #
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Member
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Phone
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Joining Date
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map(
                  (member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {
                          member.memberNumber
                        }
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {member.name}
                        </p>

                        {member.address && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {
                              member.address
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {member.phone ||
                          "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {member.joiningDate ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        {member.status ===
                        "active" ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
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
        </div>
      )}
    </div>
  );
}

export default MemberList;
