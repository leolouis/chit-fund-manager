import { useEffect, useState } from "react";

import { db } from "../../db/database";
import type { Member } from "../../types/member";
import type { Chit } from "../../types/chit";

interface MemberWithChit extends Member {
  chitName: string;
}

interface MemberListProps {
  refreshKey: number;
}

function MemberList({
  refreshKey,
}: MemberListProps) {
  const [members, setMembers] = useState<
    MemberWithChit[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);

      const allMembers = await db.members
        .orderBy("memberNumber")
        .toArray();

      const results: MemberWithChit[] = [];

      for (const member of allMembers) {
        const chit = await db.chits.get(member.chitId);

        results.push({
          ...member,
          chitName: chit?.name ?? "Unknown Chit",
        });
      }

      setMembers(results);
      setLoading(false);
    };

    loadMembers();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading members...
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">
          No members yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Add your first member to get started.
        </p>
      </div>
    );
  }

  return (
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
                Chit
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
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-5 py-4 font-medium text-slate-700">
                  {member.memberNumber}
                </td>

                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">
                    {member.name}
                  </div>

                  {member.address && (
                    <div className="max-w-xs truncate text-xs text-slate-500">
                      {member.address}
                    </div>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {member.chitName}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {member.phone || "-"}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {member.joiningDate}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberList;
