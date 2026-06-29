import { ArrowDownUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { withIconClass } from "../ui/iconProps";
import type { TenderSortOption } from "../../utils/sortTenders";

const sortOptions: Array<{ id: TenderSortOption; label: string }> = [
  { id: "neueste-projekt", label: "Neueste Projekte" },
  { id: "abgabefrist", label: "Abgabefrist" },
];

interface SortDropdownProps {
  sortBy: TenderSortOption | null;
  onSortSelect: (sort: TenderSortOption) => void;
}

export function SortDropdown({ sortBy, onSortSelect }: SortDropdownProps) {
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

  const handleSelect = (option: TenderSortOption) => {
    onSortSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Sortieren"
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex items-center gap-3xs text-filter-label transition-colors ${
          isOpen
            ? "text-text-accent"
            : "text-text-primary hover:text-text-accent"
        }`}
      >
        <ArrowDownUp {...withIconClass()} />
        Sortieren
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Sortieren"
          className="absolute left-0 top-full z-10 mt-4xs w-max min-w-full rounded-[2px] border border-border-light bg-bg-containers py-4xs"
        >
          {sortOptions.map(({ id, label }) => (
            <li key={id} role="option" aria-selected={sortBy === id}>
              <button
                type="button"
                onClick={() => handleSelect(id)}
                className={`flex w-full items-center px-3xs py-4xs text-left hover:bg-bg-light ${
                  sortBy === id ? "bg-bg-light" : ""
                }`}
              >
                <span className="whitespace-nowrap text-table text-text-primary">
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
