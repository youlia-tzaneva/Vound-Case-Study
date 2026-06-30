import { ArrowDownUp, Square, SquareCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  allTenderStatuses,
  statusLabels,
} from "../../data/statusFilter";
import type { TenderStatus } from "../../types/tender";
import { withIconClass } from "../ui/iconProps";
import {
  getFixedDropdownMenuStyle,
  useFixedDropdownStyle,
} from "./useFixedDropdownStyle";

export interface StatusFilterProps {
  selectedStatuses: Set<TenderStatus>;
  onStatusToggle: (status: TenderStatus) => void;
}

interface StatusColumnHeaderProps extends StatusFilterProps {
  className?: string;
}

export function StatusColumnHeader({
  className = "",
  selectedStatuses,
  onStatusToggle,
}: StatusColumnHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useFixedDropdownStyle(isOpen, buttonRef, menuRef, "right", {
    capMaxHeight: false,
  });

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

  const menu =
    isOpen && menuStyle ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label="Status filtern"
        aria-multiselectable="true"
        style={getFixedDropdownMenuStyle(menuStyle)}
        className="w-max overflow-y-auto rounded-[2px] border border-border-light bg-bg-containers py-4xs"
      >
        {allTenderStatuses.map((status) => {
          const isSelected = selectedStatuses.has(status);
          const CheckIcon = isSelected ? SquareCheck : Square;

          return (
            <li key={status} role="option" aria-selected={isSelected}>
              <button
                type="button"
                onClick={() => onStatusToggle(status)}
                className="flex w-full items-center gap-4xs px-3xs py-4xs text-left hover:bg-bg-light"
              >
                <CheckIcon
                  {...withIconClass(
                    isSelected ? "text-icon-selected" : undefined,
                  )}
                />
                <span className="whitespace-nowrap text-table text-text-primary">
                  {statusLabels[status]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-between gap-3xs ${className}`}
    >
      <span>Status</span>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Status filtern"
          onClick={() => setIsOpen((current) => !current)}
          className={`inline-flex items-center justify-center transition-colors ${
            isOpen
              ? "text-text-accent"
              : "text-icon-default hover:text-icon-hover"
          }`}
        >
          <ArrowDownUp {...withIconClass()} />
        </button>

        {menu && createPortal(menu, document.body)}
      </div>
    </div>
  );
}
