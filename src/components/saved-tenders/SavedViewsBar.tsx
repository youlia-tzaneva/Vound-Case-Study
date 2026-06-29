import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { SavedView } from "../../types/tender";
import type { TableColumnId } from "../../data/tableColumns";
import { withIconClass } from "../ui/iconProps";
import { CreateCustomWorkspaceModal } from "./CreateCustomWorkspaceModal";

interface SavedViewsBarProps {
  views: SavedView[];
  onSelect?: (id: string) => void;
  onCreateWorkspace?: (workspace: {
    label: string;
    columns: TableColumnId[];
  }) => void;
  onDeleteWorkspace?: (id: string) => void;
}

export function SavedViewsBar({
  views,
  onSelect,
  onCreateWorkspace,
  onDeleteWorkspace,
}: SavedViewsBarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    viewId: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    const closeMenu = () => setContextMenu(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("scroll", closeMenu, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  const handleViewContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    view: SavedView,
  ) => {
    if (!view.isCustom || !onDeleteWorkspace) {
      return;
    }

    event.preventDefault();
    setContextMenu({
      viewId: view.id,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDeleteWorkspace = () => {
    if (!contextMenu || !onDeleteWorkspace) {
      return;
    }

    onDeleteWorkspace(contextMenu.viewId);
    setContextMenu(null);
  };

  return (
    <>
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
            onContextMenu={(event) => handleViewContextMenu(event, view)}
            className={`shrink-0 rounded-[2px] px-xs py-2xs text-body transition-colors ${
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
          onClick={() => setIsCreateModalOpen(true)}
          className="flex size-6 shrink-0 items-center justify-center text-icon-default hover:text-icon-hover"
        >
          <Plus {...withIconClass()} />
        </button>
      </div>

      {contextMenu && (
        <div
          role="menu"
          aria-label="Arbeitsbereichaktionen"
          className="fixed z-50 min-w-[160px] rounded-[2px] border border-border-light bg-bg-containers py-4xs"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleDeleteWorkspace}
            className="flex w-full px-3xs py-4xs text-left text-table text-text-primary hover:bg-bg-light"
          >
            Löschen
          </button>
        </div>
      )}

      <CreateCustomWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(workspace) => onCreateWorkspace?.(workspace)}
      />
    </>
  );
}
