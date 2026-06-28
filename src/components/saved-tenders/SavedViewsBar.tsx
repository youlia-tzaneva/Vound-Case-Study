import { Plus } from "lucide-react";
import type { SavedView } from "../../types/tender";
import { withIconClass } from "../ui/iconProps";

interface SavedViewsBarProps {
  views: SavedView[];
  onSelect?: (id: string) => void;
}

export function SavedViewsBar({ views, onSelect }: SavedViewsBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Gespeicherte Ansichten"
      className="flex w-full items-center gap-5xs rounded-container border border-border-light bg-bg-containers p-3xs"
    >
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={view.isActive}
          onClick={() => onSelect?.(view.id)}
          className={`shrink-0 rounded-container px-xs py-2xs text-body transition-colors ${
            view.isActive
              ? "bg-accent-secondary text-text-inverted"
              : "text-text-primary hover:text-text-accent"
          }`}
        >
          {view.label}
        </button>
      ))}
      <button
        type="button"
        aria-label="Neue Ansicht hinzufügen"
        className="flex size-6 shrink-0 items-center justify-center"
      >
        <Plus {...withIconClass()} />
      </button>
    </div>
  );
}
