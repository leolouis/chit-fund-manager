import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./features/dashboard/Dashboard";
import ChitsPage from "./features/chits/ChitsPage";
import MembersPage from "./features/members/MembersPage";
import CollectionsPage from "./features/collections/CollectionsPage";
import OutstandingPage from "./features/outstanding/OutstandingPage";
import CyclesPage from "./features/cycles/CyclesPage";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  chits: "Chits",
  members: "Members",
  collections: "Collections",
  outstanding: "Outstanding",
  cycles: "Monthly Cycles",
  auctions: "Auctions",
  reports: "Reports",
};

function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "chits":
        return <ChitsPage />;

      case "members":
        return <MembersPage />;

      case "collections":
        return <CollectionsPage />;

      case "outstanding":
        return <OutstandingPage />;

      case "cycles":
        return <CyclesPage />;

      default:
        return (
          <div className="card">
            <h3 className="card-title">
              {pageTitles[activePage] ??
                "Coming Soon"}
            </h3>

            <p className="card-subtitle">
              This section will be built next.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="app-main">
        <Header
          title={
            pageTitles[activePage] ??
            "Chit Fund Manager"
          }
        />

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
