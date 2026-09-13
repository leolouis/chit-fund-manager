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
<aside className="sidebar">
{/* Brand */}
<div className="sidebar-header">
<div
style={{
display: "flex",
alignItems: "center",
gap: "12px",
}}
>
<div
style={{
width: "38px",
height: "38px",
borderRadius: "10px",
background: "#7c3aed",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#ffffff",
fontSize: "18px",
fontWeight: 700,
flexShrink: 0,
}}
>
₹
</div>

      <div>
        <h1 className="sidebar-title">
          Chit Fund Manager
        </h1>

        <p className="sidebar-subtitle">
          Local &amp; Offline
        </p>
      </div>
    </div>
  </div>

  {/* Navigation */}
  <nav className="sidebar-nav">
    {menuSections.map((section) => (
      <div
        key={section.title}
        style={{
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            padding: "0 12px 7px",
            color: "#64748b",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {section.title}
        </div>

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
              className={`sidebar-button${
                isActive ? " active" : ""
              }`}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "24px",
                  marginRight: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                {item.icon}
              </span>

              {item.label}
            </button>
          );
        })}
      </div>
    ))}
  </nav>

  {/* Bottom status */}
  <div
    style={{
      marginTop: "auto",
      padding: "16px",
      borderTop: "1px solid #1e293b",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#94a3b8",
        fontSize: "12px",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#22c55e",
          flexShrink: 0,
        }}
      />

      <span>Data stored locally</span>
    </div>
  </div>
</aside>


);
}

export default Sidebar;
