import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AppSidebar } from "../components/layout/AppSidebar";
import { SavedViewsBar } from "../components/saved-tenders/SavedViewsBar";
import { SavedTendersToolbar } from "../components/saved-tenders/SavedTendersToolbar";
import { ActiveFilterTags } from "../components/saved-tenders/ActiveFilterTags";
import { BulkSelectionActionBar } from "../components/saved-tenders/BulkSelectionActionBar";
import { CustomTendersTable } from "../components/saved-tenders/CustomTendersTable";
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
  TenderPanelUpdate,
  TenderPanelView,
  TenderQualification,
  TenderSidebarUpdates,
} from "../types/tender";
import { ensureSelectColumnFirst, type TableColumnId } from "../data/tableColumns";
import { mapTenderList } from "../utils/applyTenderSidebarUpdates";
import {
  markTenderUpdatesRead,
  markTenderUpdatesUnread,
} from "../utils/bulkTenderActions";
import { useTenderRowSelection } from "../hooks/useTenderRowSelection";

function filterTendersByView(
  tenders: typeof initialTenders,
  viewId: string,
) {
  if (viewId === "my") {
    return tenders.filter((tender) => tender.owner.name === currentUser.name);
  }

  return tenders;
}

function matchesOwnerFilter(
  owner: TenderOwner | null | undefined,
  ownerFilter: TenderOwner | null,
) {
  if (!ownerFilter) {
    return true;
  }

  return owner?.name === ownerFilter.name;
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
  const [ownerFilter, setOwnerFilter] = useState<TenderOwner | null>(null);

  const activeView = views.find((view) => view.isActive);
  const activeViewId = activeView?.id ?? "all";
  const searchTerm = searchQuery.trim().toLowerCase();
  const isUrgentView = activeViewId === "attention";
  const isTeamView = activeViewId === "team";
  const isLeadershipView = activeViewId === "leadership";
  const isCustomView = Boolean(activeView?.isCustom && activeView.columns);
  const customColumns = ensureSelectColumnFirst(activeView?.columns ?? []);

  const filteredTenders = filterTendersByView(tenders, activeViewId)
    .filter((tender) => tender.name.toLowerCase().includes(searchTerm))
    .filter((tender) => matchesOwnerFilter(tender.owner, ownerFilter));

  const filteredUrgentTenders = urgentTenders
    .filter((tender) => tender.name.toLowerCase().includes(searchTerm))
    .filter((tender) => matchesOwnerFilter(tender.owner, ownerFilter));

  const filteredTeamTenders = teamTenders
    .filter((tender) => tender.name.toLowerCase().includes(searchTerm))
    .filter((tender) => matchesOwnerFilter(tender.owner, ownerFilter));

  const filteredLeadershipTenders = leadershipTenders
    .filter((tender) => tender.name.toLowerCase().includes(searchTerm))
    .filter((tender) => matchesOwnerFilter(tender.owner, ownerFilter));

  const activeTenderIds = useMemo(() => {
    if (isCustomView || (!isUrgentView && !isTeamView && !isLeadershipView)) {
      return filteredTenders.map((tender) => tender.id);
    }
    if (isUrgentView) {
      return filteredUrgentTenders.map((tender) => tender.id);
    }
    if (isTeamView) {
      return filteredTeamTenders.map((tender) => tender.id);
    }
    return filteredLeadershipTenders.map((tender) => tender.id);
  }, [
    isCustomView,
    isUrgentView,
    isTeamView,
    isLeadershipView,
    filteredTenders,
    filteredUrgentTenders,
    filteredTeamTenders,
    filteredLeadershipTenders,
  ]);

  const {
    selectedIds,
    hasSelection,
    allSelected,
    someSelected,
    isSelected,
    toggleRow,
    selectAll,
    selectNone,
    toggleAll,
  } = useTenderRowSelection(activeTenderIds);
  const selectedIdList = useMemo(() => [...selectedIds], [selectedIds]);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const preservedScrollTopRef = useRef<number | null>(null);
  const bulkMarkReadStateRef = useRef<{
    affectedIds: string[];
    panelUpdatesSnapshot: TenderPanelUpdate[] | null;
    panelTenderId: string | null;
  } | null>(null);
  const tendersRef = useRef(tenders);
  const urgentTendersRef = useRef(urgentTenders);
  const teamTendersRef = useRef(teamTenders);
  const leadershipTendersRef = useRef(leadershipTenders);
  const panelTenderRef = useRef(panelTender);

  tendersRef.current = tenders;
  urgentTendersRef.current = urgentTenders;
  teamTendersRef.current = teamTenders;
  leadershipTendersRef.current = leadershipTenders;
  panelTenderRef.current = panelTender;

  const preserveTableScroll = useCallback(() => {
    if (tableScrollRef.current) {
      preservedScrollTopRef.current = tableScrollRef.current.scrollTop;
    }
  }, []);

  const handleRowSelectedChange = useCallback(
    (id: string, checked: boolean) => {
      preserveTableScroll();
      toggleRow(id, checked);
    },
    [preserveTableScroll, toggleRow],
  );

  const handleSelectAll = useCallback(() => {
    preserveTableScroll();
    selectAll();
  }, [preserveTableScroll, selectAll]);

  const handleSelectNone = useCallback(() => {
    preserveTableScroll();
    selectNone();
  }, [preserveTableScroll, selectNone]);

  const handleToggleAll = useCallback(() => {
    preserveTableScroll();
    toggleAll();
  }, [preserveTableScroll, toggleAll]);

  useLayoutEffect(() => {
    const scrollContainer = tableScrollRef.current;
    const preservedScrollTop = preservedScrollTopRef.current;

    if (scrollContainer && preservedScrollTop !== null) {
      scrollContainer.scrollTop = preservedScrollTop;
      preservedScrollTopRef.current = null;
    }
  }, [hasSelection, selectedIds]);

  useEffect(() => {
    selectNone();
    tableScrollRef.current?.scrollTo({ top: 0 });
  }, [activeViewId, selectNone]);

  useEffect(() => {
    bulkMarkReadStateRef.current = null;
  }, [selectedIdList]);

  useEffect(() => {
    tableScrollRef.current?.scrollTo({ top: 0 });
  }, [searchTerm, ownerFilter]);

  const handleViewSelect = (id: string) => {
    setIsPanelOpen(false);
    setViews((current) =>
      current.map((view) => ({ ...view, isActive: view.id === id })),
    );
  };

  const handleCreateWorkspace = ({
    label,
    columns,
  }: {
    label: string;
    columns: TableColumnId[];
  }) => {
    setIsPanelOpen(false);
    setViews((current) => [
      ...current.map((view) => ({ ...view, isActive: false })),
      {
        id: `custom-${Date.now()}`,
        label,
        isActive: true,
        isCustom: true,
        columns: ensureSelectColumnFirst(columns),
      },
    ]);
  };

  const handleDeleteWorkspace = useCallback((id: string) => {
    setIsPanelOpen(false);
    setViews((current) => {
      const viewToDelete = current.find((view) => view.id === id);

      if (!viewToDelete?.isCustom) {
        return current;
      }

      const remaining = current.filter((view) => view.id !== id);

      if (!viewToDelete.isActive || remaining.length === 0) {
        return remaining;
      }

      const nextActiveId =
        remaining.find((view) => view.id === "all")?.id ?? remaining[0].id;

      return remaining.map((view) => ({
        ...view,
        isActive: view.id === nextActiveId,
      }));
    });
  }, []);

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

  const handleQualificationChange = useCallback(
    (tenderId: string, qualification: TenderQualification) => {
      handleTenderUpdate(tenderId, { qualification });
    },
    [handleTenderUpdate],
  );

  const handleBulkOwnerChange = useCallback(
    (tenderIds: string[], owner: TenderOwner) => {
      tenderIds.forEach((tenderId) => handleOwnerChange(tenderId, owner));
    },
    [handleOwnerChange],
  );

  const handleBulkTeamChange = useCallback(
    (tenderIds: string[], team: string) => {
      tenderIds.forEach((tenderId) => handleTeamChange(tenderId, team));
    },
    [handleTeamChange],
  );

  const handleBulkMarkUpdatesReadChange = useCallback(
    (markAsRead: boolean, tenderIds: string[]) => {
      if (markAsRead) {
        const idSet = new Set(tenderIds);
        const affectedIds = [
          ...new Set(
            [
              ...tendersRef.current,
              ...urgentTendersRef.current,
              ...teamTendersRef.current,
              ...leadershipTendersRef.current,
            ]
              .filter(
                (tender) =>
                  idSet.has(tender.id) &&
                  "update" in tender &&
                  tender.update?.isNew,
              )
              .map((tender) => tender.id),
          ),
        ];

        setTenders((current) => markTenderUpdatesRead(current, tenderIds).list);
        setUrgentTenders((current) =>
          markTenderUpdatesRead(current, tenderIds).list,
        );
        setTeamTenders((current) =>
          markTenderUpdatesRead(current, tenderIds).list,
        );
        setLeadershipTenders((current) =>
          markTenderUpdatesRead(current, tenderIds).list,
        );

        const openPanelTender = panelTenderRef.current;
        let panelUpdatesSnapshot: TenderPanelUpdate[] | null = null;
        let panelTenderId: string | null = null;

        if (openPanelTender && tenderIds.includes(openPanelTender.id)) {
          panelUpdatesSnapshot = openPanelTender.updates.map((update) => ({
            ...update,
          }));
          panelTenderId = openPanelTender.id;

          setPanelTender({
            ...openPanelTender,
            updates: openPanelTender.updates.map((update) => ({
              ...update,
              isNew: false,
            })),
          });
        }

        bulkMarkReadStateRef.current = {
          affectedIds,
          panelUpdatesSnapshot,
          panelTenderId,
        };
        return;
      }

      const bulkMarkReadState = bulkMarkReadStateRef.current;
      if (!bulkMarkReadState) {
        return;
      }

      const { affectedIds, panelUpdatesSnapshot, panelTenderId } =
        bulkMarkReadState;

      setTenders((current) => markTenderUpdatesUnread(current, affectedIds));
      setUrgentTenders((current) =>
        markTenderUpdatesUnread(current, affectedIds),
      );
      setTeamTenders((current) => markTenderUpdatesUnread(current, affectedIds));
      setLeadershipTenders((current) =>
        markTenderUpdatesUnread(current, affectedIds),
      );
      setPanelTender((current) => {
        if (
          !current ||
          !panelTenderId ||
          current.id !== panelTenderId ||
          !panelUpdatesSnapshot
        ) {
          return current;
        }

        return {
          ...current,
          updates: panelUpdatesSnapshot,
        };
      });

      bulkMarkReadStateRef.current = null;
    },
    [],
  );

  const runBulkAction = useCallback(
    (action: () => void) => {
      preserveTableScroll();
      action();
    },
    [preserveTableScroll],
  );

  const tableSelectionProps = {
    isRowSelected: isSelected,
    onRowSelectedChange: handleRowSelectedChange,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <AppSidebar />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-l py-s">
        <div className="flex shrink-0 flex-col gap-xs">
          <h1 className="text-h2 text-text-primary">Projekte</h1>

          <div className="flex w-full flex-col gap-3xs">
            <SavedViewsBar
              views={views}
              onSelect={handleViewSelect}
              onCreateWorkspace={handleCreateWorkspace}
              onDeleteWorkspace={handleDeleteWorkspace}
            />
            <SavedTendersToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOwnerFilterSelect={setOwnerFilter}
            />
            <ActiveFilterTags
              ownerFilter={ownerFilter}
              onRemoveOwnerFilter={() => setOwnerFilter(null)}
            />
          </div>
        </div>

        <div className="relative mt-xs min-h-0 flex-1">
          {hasSelection && (
            <div className="absolute inset-x-0 top-0 z-10 bg-bg-base pb-xs">
              <BulkSelectionActionBar
                allSelected={allSelected}
                someSelected={someSelected}
                onSelectAll={handleSelectAll}
                onSelectNone={handleSelectNone}
                onToggleAll={handleToggleAll}
                onOwnerChange={(owner) =>
                  runBulkAction(() =>
                    handleBulkOwnerChange(selectedIdList, owner),
                  )
                }
                onTeamChange={(team) =>
                  runBulkAction(() => handleBulkTeamChange(selectedIdList, team))
                }
                onMarkUpdatesReadChange={(markAsRead) =>
                  runBulkAction(() =>
                    handleBulkMarkUpdatesReadChange(markAsRead, selectedIdList),
                  )
                }
                selectedIdsKey={selectedIdList.join(",")}
              />
            </div>
          )}

          <div
            ref={tableScrollRef}
            className="h-full overflow-y-auto [overflow-anchor:none]"
          >
          {isCustomView ? (
            <CustomTendersTable
              tenders={filteredTenders}
              columns={customColumns}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onQualificationChange={handleQualificationChange}
              {...tableSelectionProps}
            />
          ) : isUrgentView ? (
            <UrgentTendersTable
              tenders={filteredUrgentTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onQualificationChange={handleQualificationChange}
              {...tableSelectionProps}
            />
          ) : isTeamView ? (
            <TeamTendersTable
              tenders={filteredTeamTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onTeamChange={handleTeamChange}
              {...tableSelectionProps}
            />
          ) : isLeadershipView ? (
            <LeadershipTendersTable
              tenders={filteredLeadershipTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onTeamChange={handleTeamChange}
              onQualificationChange={handleQualificationChange}
              {...tableSelectionProps}
            />
          ) : (
            <TendersTable
              tenders={filteredTenders}
              activeTenderId={isPanelOpen ? panelTender?.id ?? null : null}
              onTenderOpen={handleTenderOpen}
              onOwnerChange={handleOwnerChange}
              onQualificationChange={handleQualificationChange}
              {...tableSelectionProps}
            />
          )}
          </div>
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
