import { useState } from "react";

import type { Chit } from "../../types/chit";
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
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Members
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Manage members belonging to your chit groups.
        </p>
      </div>

      <MemberList
        selectedChitId={selectedChitId}
        onChitChange={setSelectedChitId}
        refreshKey={refreshKey}
      />

      {selectedChitId !== null && (
        <div className="mt-6">
          {!showForm ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
              >
                + Add Member
              </button>
            </div>
          ) : (
            <MemberForm
              chitId={selectedChitId}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MembersPage;
