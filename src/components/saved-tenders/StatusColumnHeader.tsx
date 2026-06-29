import { ArrowDownUp, Square, SquareCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  allTenderStatuses,
  statusLabels,
} from "../../data/statusFilter";
import type { TenderStatus } from "../../types/tender";
import { withIconClass } from "../ui/iconProps";

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-between gap-3xs ${className}`}
    >
      <span>Status</span>
      <div className="relative">
        <button
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

        {isOpen && (
          <ul
            role="listbox"
            aria-label="Status filtern"
            aria-multiselectable="true"
            className="absolute right-0 top-full z-20 mt-4xs w-max rounded-[2px] border border-border-light bg-bg-containers py-4xs"
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
        )}
      </div>
    </div>
  );
}
