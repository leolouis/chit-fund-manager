import { useState } from "react";

import OutstandingList from "./OutstandingList";

function OutstandingPage() {
const [refreshKey, setRefreshKey] = useState(0);

return (
<div className="space-y-6">
{/* Page Header */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
<div>
<h3 className="text-2xl font-bold tracking-tight text-slate-900">
Outstanding
</h3>

      <p className="mt-1 text-sm text-slate-500">
        Track pending member payments and outstanding balances.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        setRefreshKey((value) => value + 1)
      }
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="text-base">↻</span>
      Refresh
    </button>
  </div>

  {/* Outstanding Content */}
  <OutstandingList refreshKey={refreshKey} />
</div>


);
}

export default OutstandingPage;
