interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuSections = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "▦" },
    ],
  },
  {
    title: "Management",
    items: [
      { id: "chits", label: "Chits", icon: "◫" },
      { id: "members", label: "Members", icon: "♙" },
      { id: "collections", label: "Collections", icon: "₹" },
      { id: "outstanding", label: "Outstanding", icon: "!" },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "cycles", label: "Monthly Cycles", icon: "↻" },
      { id: "auctions", label: "Auctions", icon: "◆" },
    ],
  },
  {
    title: "Reports",
    items: [
      { id: "reports", label: "Reports", icon: "▤" },
    ],
  },
];

function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-900 text-white">
      {/* Brand */}
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold">
            ₹
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white">
              Chit Fund Manager
            </h1>

            <p className="mt-0.5 text-xs text-slate-400">
              Local & Offline
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-5">
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  activePage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onNavigate(item.id)
                    }
                    className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-violet-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 flex w-5 justify-center text-base font-bold">
                      {item.icon}
                    </span>

                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span>Data stored locally</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
