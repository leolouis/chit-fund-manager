interface SidebarProps {
activePage: string;
onNavigate: (page: string) => void;
}

const menuSections = [
{
title: "Overview",
items: [
{
id: "dashboard",
label: "Dashboard",
icon: "▦",
color: "#a78bfa",
},
],
},
{
title: "Management",
items: [
{
id: "chits",
label: "Chits",
icon: "◫",
color: "#60a5fa",
},
{
id: "members",
label: "Members",
icon: "♙",
color: "#34d399",
},
{
id: "collections",
label: "Collections",
icon: "₹",
color: "#fbbf24",
},
{
id: "outstanding",
label: "Outstanding",
icon: "!",
color: "#fb7185",
},
],
},
{
title: "Operations",
items: [
{
id: "cycles",
label: "Monthly Cycles",
icon: "↻",
color: "#22d3ee",
},
{
id: "auctions",
label: "Auctions",
icon: "◆",
color: "#c084fc",
},
],
},
{
title: "Reports",
items: [
{
id: "reports",
label: "Reports",
icon: "▤",
color: "#818cf8",
},
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
width: "40px",
height: "40px",
borderRadius: "11px",
background:
"linear-gradient(135deg, #8b5cf6, #6d28d9)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#ffffff",
fontSize: "19px",
fontWeight: 800,
boxShadow:
"0 6px 18px rgba(124, 58, 237, 0.35)",
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
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            padding: "0 12px 8px",
            color: "#64748b",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "rgba(255,255,255,0.15)"
                    : `${item.color}18`,
                  color: isActive
                    ? "#ffffff"
                    : item.color,
                  fontSize: "16px",
                  fontWeight: 800,
                  flexShrink: 0,
                  transition:
                    "all 0.15s ease",
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow:
                      "0 0 8px rgba(255,255,255,0.8)",
                  }}
                />
              )}
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
      borderTop:
        "1px solid rgba(148, 163, 184, 0.12)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
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
          boxShadow:
            "0 0 8px rgba(34,197,94,0.6)",
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
