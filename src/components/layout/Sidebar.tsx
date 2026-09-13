interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "chits", label: "Chits" },
  { id: "members", label: "Members" },
  { id: "collections", label: "Collections" },
  { id: "auctions", label: "Auctions" },
  { id: "reports", label: "Reports" },
];

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h1 className="text-lg font-bold text-violet-700">
          Chit Fund Manager
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Local & Offline
        </p>
      </div>

      <nav className="p-3">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`mb-1 w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
