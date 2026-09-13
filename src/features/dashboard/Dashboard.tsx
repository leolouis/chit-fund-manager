const stats = [
  {
    label: "Active Chits",
    value: "0",
    color: "violet",
  },
  {
    label: "Members",
    value: "0",
    color: "blue",
  },
  {
    label: "Collected",
    value: "₹0",
    color: "emerald",
  },
  {
    label: "Outstanding",
    value: "₹0",
    color: "amber",
  },
];

function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your chit fund operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h4 className="font-semibold text-slate-900">
            Pending Payments
          </h4>

          <p className="mt-3 text-sm text-slate-500">
            No pending payments yet.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h4 className="font-semibold text-slate-900">
            Upcoming Auctions
          </h4>

          <p className="mt-3 text-sm text-slate-500">
            No upcoming auctions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
