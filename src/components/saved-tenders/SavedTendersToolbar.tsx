import {
  Calendar,
  Columns3,
  Search,
  SlidersHorizontal,
  Table2,
  type LucideIcon,
} from "lucide-react";
import type { TenderOwner } from "../../types/tender";
import { withIconClass } from "../ui/iconProps";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { ColumnsDropdown } from "./ColumnsDropdown";
import type { TenderSortOption } from "../../utils/sortTenders";
import type { TableColumnId } from "../../data/tableColumns";

interface SavedTendersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOwnerFilterSelect: (owner: TenderOwner) => void;
  sortBy: TenderSortOption | null;
  onSortSelect: (sort: TenderSortOption) => void;
  columns?: TableColumnId[];
  onColumnsChange?: (columns: TableColumnId[]) => void;
}

export function SavedTendersToolbar({
  searchQuery,
  onSearchChange,
  onOwnerFilterSelect,
  sortBy,
  onSortSelect,
  columns,
  onColumnsChange,
}: SavedTendersToolbarProps) {
  return (
    <div className="flex w-full items-center gap-m rounded-container border border-border-light bg-bg-containers px-xs py-3xs">
      <FilterDropdown onOwnerFilterSelect={onOwnerFilterSelect} />

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

      <SortDropdown sortBy={sortBy} onSortSelect={onSortSelect} />

      {columns && onColumnsChange ? (
        <ColumnsDropdown columns={columns} onColumnsChange={onColumnsChange} />
      ) : (
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-3xs text-filter-label text-text-primary hover:text-text-accent"
        >
          <SlidersHorizontal {...withIconClass()} />
          Spalten
        </button>
      )}

      <div
        className="flex shrink-0 items-stretch gap-4xs self-stretch"
        role="group"
        aria-label="Ansicht wechseln"
      >
        <ViewToggle icon={Table2} label="Rasteransicht" active />
        <ViewToggle icon={Calendar} label="Kalenderansicht" />
        <ViewToggle icon={Columns3} label="Listenansicht" />
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
      className={`relative flex aspect-square h-full shrink-0 items-center justify-center rounded-container transition-colors ${
        active ? "text-icon-selected" : "text-icon-default hover:text-icon-hover"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-container bg-bg-light"
        />
      )}
      <Icon
        {...withIconClass("relative z-10")}
        strokeWidth={0.75}
      />
    </button>
  );
}
