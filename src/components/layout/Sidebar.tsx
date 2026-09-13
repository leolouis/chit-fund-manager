interface SidebarProps {
activePage: string;
onNavigate: (page: string) => void;
}

type IconName =
| "dashboard"
| "chits"
| "members"
| "collections"
| "outstanding"
| "cycles"
| "auctions"
| "reports";

const menuSections: {
title: string;
items: {
id: string;
label: string;
icon: IconName;
color: string;
}[];
}[] = [
{
title: "Overview",
items: [
{
id: "dashboard",
label: "Dashboard",
icon: "dashboard",
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
icon: "chits",
color: "#60a5fa",
},
{
id: "members",
label: "Members",
icon: "members",
color: "#34d399",
},
{
id: "collections",
label: "Collections",
icon: "collections",
color: "#fbbf24",
},
{
id: "outstanding",
label: "Outstanding",
icon: "outstanding",
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
icon: "cycles",
color: "#22d3ee",
},
{
id: "auctions",
label: "Auctions",
icon: "auctions",
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
icon: "reports",
color: "#818cf8",
},
],
},
];

function MenuIcon({
name,
color,
}: {
name: IconName;
color: string;
}) {
const common = {
width: 18,
height: 18,
viewBox: "0 0 24 24",
fill: "none",
stroke: "currentColor",
strokeWidth: 1.9,
strokeLinecap: "round" as const,
strokeLinejoin: "round" as const,
};

switch (name) {
case "dashboard":
return (
<svg {...common}>
<rect x="3" y="3" width="7" height="7" rx="1" />
<rect x="14" y="3" width="7" height="7" rx="1" />
<rect x="3" y="14" width="7" height="7" rx="1" />
<rect x="14" y="14" width="7" height="7" rx="1" />
</svg>
);

case "chits":
  return (
    <svg {...common}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );

case "members":
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c.8-4 3.2-6 7-6s6.2 2 7 6" />
    </svg>
  );

case "collections":
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 8.5c-.8-.7-1.8-1-3-1-1.8 0-3 .9-3 2.1 0 3.2 6 1.5 6 4.7 0 1.3-1.2 2.2-3 2.2-1.2 0-2.3-.4-3.1-1.1" />
      <path d="M12 5.5v13" />
    </svg>
  );

case "outstanding":
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5" />
      <circle
        cx="12"
        cy="16.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );

case "cycles":
  return (
    <svg {...common}>
      <path d="M20 11a8 8 0 0 0-14.8-4L3 10" />
      <path d="M3 5v5h5" />
      <path d="M4 13a8 8 0 0 0 14.8 4L21 14" />
      <path d="M21 19v-5h-5" />
    </svg>
  );

case "auctions":
  return (
    <svg {...common}>
      <path d="M14 4l6 6" />
      <path d="M16 2l6 6" />
      <path d="M13 5L5 13" />
      <path d="M3 15l6 6" />
      <path d="M5 13l6 6" />
      <path d="M3 21h18" />
    </svg>
  );

case "reports":
  return (
    <svg {...common}>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v5h4" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
      <path d="M8 9h3" />
    </svg>
  );

default:
  return null;


}
}

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
color: "#fff",
fontSize: "19px",
fontWeight: 800,
boxShadow:
"0 6px 18px rgba(124,58,237,.35)",
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
                  width: "34px",
                  height: "34px",
                  minWidth: "34px",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "rgba(255,255,255,.15)"
                    : `${item.color}18`,
                  color: isActive
                    ? "#ffffff"
                    : item.color,
                }}
              >
                <MenuIcon
                  name={item.icon}
                  color={item.color}
                />
              </span>

              <span
                style={{
                  flex: 1,
                  textAlign: "left",
                  lineHeight: "20px",
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
                      "0 0 8px rgba(255,255,255,.8)",
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
        "1px solid rgba(148,163,184,.12)",
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
            "0 0 8px rgba(34,197,94,.6)",
        }}
      />

      <span>Data stored locally</span>
    </div>
  </div>
</aside>


);
}

export default Sidebar;
