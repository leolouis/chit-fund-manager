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
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h3 className="text-xl font-semibold text-slate-900">
              {pageTitles[activePage] ??
                "Coming Soon"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              This section will be built next.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={
            pageTitles[activePage] ??
            "Chit Fund Manager"
          }
        />

        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
