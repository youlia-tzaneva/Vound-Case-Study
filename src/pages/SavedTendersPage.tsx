import { useState } from "react";
import { AppSidebar } from "../components/layout/AppSidebar";
import { SavedViewsBar } from "../components/saved-tenders/SavedViewsBar";
import { SavedTendersToolbar } from "../components/saved-tenders/SavedTendersToolbar";
import { TendersTable } from "../components/saved-tenders/TendersTable";
import { UrgentTendersTable } from "../components/saved-tenders/UrgentTendersTable";
import { TeamTendersTable } from "../components/saved-tenders/TeamTendersTable";
import { LeadershipTendersTable } from "../components/saved-tenders/LeadershipTendersTable";
import { TenderSidePanelDrawer } from "../components/saved-tenders/TenderSidePanelDrawer";
import {
  currentUser,
  mockTenders,
  mockLeadershipTenders,
  mockTeamTenders,
  mockUrgentTenders,
  savedViews,
} from "../data/mockTenders";
import { toTenderPanelView } from "../data/tenderPanelDetails";
import type { TenderListItem, TenderPanelView } from "../types/tender";

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
  const [panelTender, setPanelTender] = useState<TenderPanelView | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const activeViewId = views.find((view) => view.isActive)?.id ?? "all";
  const searchTerm = searchQuery.trim().toLowerCase();
  const isUrgentView = activeViewId === "attention";
  const isTeamView = activeViewId === "team";
  const isLeadershipView = activeViewId === "leadership";

  const filteredTenders = filterTendersByView(mockTenders, activeViewId).filter(
    (tender) => tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredUrgentTenders = mockUrgentTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredTeamTenders = mockTeamTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredLeadershipTenders = mockLeadershipTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const handleViewSelect = (id: string) => {
    setIsPanelOpen(false);
    setViews((current) =>
      current.map((view) => ({ ...view, isActive: view.id === id })),
    );
  };

  const handleTenderOpen = (tender: TenderListItem) => {
    setPanelTender(toTenderPanelView(tender));
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  const handlePanelClosed = () => {
    setPanelTender(null);
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
          <UrgentTendersTable
            tenders={filteredUrgentTenders}
            activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
            onTenderOpen={handleTenderOpen}
          />
        ) : isTeamView ? (
          <TeamTendersTable
            tenders={filteredTeamTenders}
            activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
            onTenderOpen={handleTenderOpen}
          />
        ) : isLeadershipView ? (
          <LeadershipTendersTable
            tenders={filteredLeadershipTenders}
            activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
            onTenderOpen={handleTenderOpen}
          />
        ) : (
          <TendersTable
            tenders={filteredTenders}
            activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
            onTenderOpen={handleTenderOpen}
          />
        )}
      </main>

      <TenderSidePanelDrawer
        tender={panelTender}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onClosed={handlePanelClosed}
      />
    </div>
  );
}
