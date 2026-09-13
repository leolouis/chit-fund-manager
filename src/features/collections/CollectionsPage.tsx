import { useState } from "react";

import CollectionForm from "./CollectionForm";
import CollectionList from "./CollectionList";

function CollectionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setRefreshKey((value) => value + 1);
  };

  if (showForm) {
    return (
      <CollectionForm
        onSaved={handleSaved}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Collections
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Record and track member payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          + Record Payment
        </button>
      </div>

      <CollectionList refreshKey={refreshKey} />
    </div>
  );
}

export default CollectionsPage;
