import { useState } from "react";

import OutstandingList from "./OutstandingList";

function OutstandingPage() {
  const [refreshKey, setRefreshKey] =
    useState(0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Outstanding
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            See who has pending payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setRefreshKey(
              (value) => value + 1,
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <OutstandingList
        refreshKey={refreshKey}
      />
    </div>
  );
}

export default OutstandingPage;
