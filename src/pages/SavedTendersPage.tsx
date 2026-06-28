import { useCallback, useState } from "react";
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
  mockTenders as initialTenders,
  mockLeadershipTenders as initialLeadershipTenders,
  mockTeamTenders as initialTeamTenders,
  mockUrgentTenders as initialUrgentTenders,
  savedViews,
} from "../data/mockTenders";
import { toTenderPanelView } from "../data/tenderPanelDetails";
import type {
  TenderListItem,
  TenderOwner,
  TenderPanelView,
  TenderSidebarUpdates,
} from "../types/tender";
import { mapTenderList } from "../utils/applyTenderSidebarUpdates";

function filterTendersByView(
  tenders: typeof initialTenders,
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
  const [tenders, setTenders] = useState(initialTenders);
  const [urgentTenders, setUrgentTenders] = useState(initialUrgentTenders);
  const [teamTenders, setTeamTenders] = useState(initialTeamTenders);
  const [leadershipTenders, setLeadershipTenders] = useState(
    initialLeadershipTenders,
  );
  const [panelTender, setPanelTender] = useState<TenderPanelView | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const activeViewId = views.find((view) => view.isActive)?.id ?? "all";
  const searchTerm = searchQuery.trim().toLowerCase();
  const isUrgentView = activeViewId === "attention";
  const isTeamView = activeViewId === "team";
  const isLeadershipView = activeViewId === "leadership";

  const filteredTenders = filterTendersByView(tenders, activeViewId).filter(
    (tender) => tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredUrgentTenders = urgentTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredTeamTenders = teamTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchTerm),
  );

  const filteredLeadershipTenders = leadershipTenders.filter((tender) =>
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

  const handleTenderUpdate = useCallback(
    (tenderId: string, updates: TenderSidebarUpdates) => {
      setTenders((current) => mapTenderList(current, tenderId, updates));
      setUrgentTenders((current) => mapTenderList(current, tenderId, updates));
      setTeamTenders((current) => mapTenderList(current, tenderId, updates));
      setLeadershipTenders((current) =>
        mapTenderList(current, tenderId, updates),
      );
      setPanelTender((current) =>
        current?.id === tenderId ? { ...current, ...updates } : current,
      );
    },
    [],
  );

  const handleOwnerChange = useCallback(
    (tenderId: string, owner: TenderOwner) => {
      handleTenderUpdate(tenderId, { owner });
    },
    [handleTenderUpdate],
  );

  const handleTeamChange = useCallback(
    (tenderId: string, team: string) => {
      handleTenderUpdate(tenderId, { team });
    },
    [handleTenderUpdate],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <AppSidebar />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-xs overflow-hidden px-l py-s">
        <h1 className="text-h2 text-text-primary">Projekte</h1>

        <div className="flex w-full flex-col gap-3xs">
          <SavedViewsBar views={views} onSelect={handleViewSelect} />
          <SavedTendersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isUrgentView ? (
            <UrgentTendersTable
              tenders={filteredUrgentTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
            />
          ) : isTeamView ? (
            <TeamTendersTable
              tenders={filteredTeamTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onTeamChange={handleTeamChange}
            />
          ) : isLeadershipView ? (
            <LeadershipTendersTable
              tenders={filteredLeadershipTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onTeamChange={handleTeamChange}
            />
          ) : (
            <TendersTable
              tenders={filteredTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
            />
          )}
        </div>
      </main>

      <TenderSidePanelDrawer
        tender={panelTender}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onClosed={handlePanelClosed}
        onTenderUpdate={handleTenderUpdate}
      />
    </div>
  );
}
