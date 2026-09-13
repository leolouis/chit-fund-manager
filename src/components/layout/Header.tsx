interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h2 className="app-header-title">
          {title}
        </h2>

        <p className="app-header-subtitle">
          Chit Fund Management
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 11px",
            borderRadius: "999px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />

          Offline
        </div>

        <button
          type="button"
          className="btn btn-secondary"
        >
          <span>↓</span>
          Backup
        </button>

        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#ede9fe",
            color: "#6d28d9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "14px",
          }}
          title="Host"
        >
          H
        </div>
      </div>
    </header>
  );
}

export default Header;
