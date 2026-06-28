import { useState } from "react";
import { AppSidebar } from "../components/layout/AppSidebar";
import { SavedViewsBar } from "../components/saved-tenders/SavedViewsBar";
import { SavedTendersToolbar } from "../components/saved-tenders/SavedTendersToolbar";
import { TendersTable } from "../components/saved-tenders/TendersTable";
import { UrgentTendersTable } from "../components/saved-tenders/UrgentTendersTable";
import { TeamTendersTable } from "../components/saved-tenders/TeamTendersTable";
import {
  currentUser,
  mockTenders,
  mockTeamTenders,
  mockUrgentTenders,
  savedViews,
} from "../data/mockTenders";

function filterTendersByView(
  tenders: typeof mockTenders,
  viewId: string,
) {
  if (viewId === "my") {
    return tenders.filter((tender) => tender.owner.name === currentUser.name);
  }

  return tenders;
}

export function SavedTendersPage() {
  const [views, setViews] = useState(savedViews);
  const [searchQuery, setSearchQuery] = useState("");

  const activeViewId = views.find((view) => view.isActive)?.id ?? "all";
  const searchTerm = searchQuery.trim().toLowerCase();
  const isUrgentView = activeViewId === "attention";
  const isTeamView = activeViewId === "team";

  const filteredTenders = filterTendersByView(mockTenders, activeViewId).filter(
    (tender) => tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredUrgentTenders = mockUrgentTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredTeamTenders = mockTeamTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const handleViewSelect = (id: string) => {
    setViews((current) =>
      current.map((view) => ({ ...view, isActive: view.id === id })),
    );
  };

  return (
    <div className="flex h-full min-h-screen bg-bg-base">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-xs px-l py-s">
        <h1 className="text-h2 text-text-primary">Projekte</h1>

        <div className="flex w-full flex-col gap-3xs">
          <SavedViewsBar views={views} onSelect={handleViewSelect} />
          <SavedTendersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {isUrgentView ? (
          <UrgentTendersTable tenders={filteredUrgentTenders} />
        ) : isTeamView ? (
          <TeamTendersTable tenders={filteredTeamTenders} />
        ) : (
          <TendersTable tenders={filteredTenders} />
        )}
      </main>
    </div>
  );
}
