import { Check, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  configurableTableColumnOrder,
  configurableTableColumns,
  immovableCustomWorkspaceColumnIds,
  normalizeCustomWorkspaceColumns,
  toggleCustomWorkspaceColumn,
  type TableColumnId,
} from "../../data/tableColumns";
import { withIconClass } from "../ui/iconProps";
import {
  getFixedDropdownMenuStyle,
  useFixedDropdownStyle,
} from "./useFixedDropdownStyle";

interface ColumnsDropdownProps {
  columns: TableColumnId[];
  onColumnsChange: (columns: TableColumnId[]) => void;
}

const columnLabels = new Map(
  configurableTableColumns.map((column) => [column.id, column.label]),
);

export function ColumnsDropdown({
  columns,
  onColumnsChange,
}: ColumnsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useFixedDropdownStyle(isOpen, buttonRef, menuRef);
  const visibleColumns = new Set(normalizeCustomWorkspaceColumns(columns));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (columnId: TableColumnId) => {
    const isVisible = visibleColumns.has(columnId);

    if (isVisible && immovableCustomWorkspaceColumnIds.has(columnId)) {
      return;
    }

    onColumnsChange(
      toggleCustomWorkspaceColumn(columns, columnId, !isVisible),
    );
  };

  const menu =
    isOpen && menuStyle ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label="Spalten"
        aria-multiselectable="true"
        style={getFixedDropdownMenuStyle(menuStyle)}
        className="w-max overflow-y-auto rounded-[2px] border border-border-light bg-bg-containers py-4xs"
      >
        {configurableTableColumnOrder.map((columnId) => {
          const isVisible = visibleColumns.has(columnId);
          const label = columnLabels.get(columnId) ?? columnId;

          return (
            <li key={columnId} role="option" aria-selected={isVisible}>
              <button
                type="button"
                onClick={() => handleToggle(columnId)}
                disabled={
                  isVisible && immovableCustomWorkspaceColumnIds.has(columnId)
                }
                className="flex w-full items-center gap-4xs px-3xs py-4xs text-left hover:bg-bg-light disabled:cursor-default"
              >
                <span className="inline-flex w-4 shrink-0 justify-center">
                  {isVisible ? (
                    <Check {...withIconClass()} size={16} />
                  ) : null}
                </span>
                <span className="whitespace-nowrap text-table text-text-primary">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Spalten"
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex items-center gap-3xs text-filter-label transition-colors ${
          isOpen
            ? "text-text-accent"
            : "text-text-primary hover:text-text-accent"
        }`}
      >
        <SlidersHorizontal {...withIconClass()} />
        Spalten
      </button>

      {menu && createPortal(menu, document.body)}
    </div>
  );
}
