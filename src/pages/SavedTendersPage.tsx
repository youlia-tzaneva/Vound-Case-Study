import { useState } from "react";
import { AppSidebar } from "../components/layout/AppSidebar";
import { SavedViewsBar } from "../components/saved-tenders/SavedViewsBar";
import { SavedTendersToolbar } from "../components/saved-tenders/SavedTendersToolbar";
import { TendersTable } from "../components/saved-tenders/TendersTable";
import { mockTenders, savedViews } from "../data/mockTenders";

export function SavedTendersPage() {
  const [views, setViews] = useState(savedViews);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTenders = mockTenders.filter((tender) =>
    tender.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
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

        <TendersTable tenders={filteredTenders} />
      </main>
    </div>
  );
}
