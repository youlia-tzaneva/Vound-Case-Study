import {
  Calendar,
  Columns3,
  Filter,
  Search,
  SlidersHorizontal,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { withIconClass } from "../ui/iconProps";

interface SavedTendersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SavedTendersToolbar({
  searchQuery,
  onSearchChange,
}: SavedTendersToolbarProps) {
  return (
    <div className="flex w-full items-center gap-m rounded-container border border-border-light bg-bg-containers px-xs py-3xs">
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-3xs text-filter-label text-text-primary hover:text-text-accent"
      >
        <Filter {...withIconClass()} />
        Filter
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-xs rounded-container border border-border-light px-xs py-3xs">
        <Search {...withIconClass()} size={20} />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nach Titel suchen..."
          aria-label="Nach Titel suchen"
          className="min-w-0 flex-1 border-0 bg-transparent text-body text-text-secondary outline-none placeholder:text-text-secondary"
        />
      </div>

      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-3xs text-filter-label text-text-primary hover:text-text-accent"
      >
        <SlidersHorizontal {...withIconClass()} />
        Spalten
      </button>

      <div
        className="flex shrink-0 items-center gap-xs"
        role="group"
        aria-label="Ansicht wechseln"
      >
        <ViewToggle icon={Table2} label="Rasteransicht" />
        <ViewToggle icon={Calendar} label="Kalenderansicht" />
        <ViewToggle icon={Columns3} label="Listenansicht" active />
      </div>
    </div>
  );
}

function ViewToggle({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className="flex items-center justify-center"
    >
      <Icon {...withIconClass()} />
    </button>
  );
}
