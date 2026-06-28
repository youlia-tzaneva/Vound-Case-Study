import { ChevronDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { withIconClass } from "../ui/iconProps";

interface PanelDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  ariaLabel: string;
  trigger: ReactNode;
  children: ReactNode;
}

export function PanelDropdown({
  isOpen,
  onToggle,
  onClose,
  ariaLabel,
  trigger,
  children,
}: PanelDropdownProps) {
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
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4xs rounded-[2px] border border-border-light bg-bg-containers px-3xs py-4xs text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4xs">{trigger}</div>
        <ChevronDown
          {...withIconClass(`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`)}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-10 mt-4xs max-h-[160px] overflow-y-auto rounded-[2px] border border-border-light bg-bg-containers py-4xs"
        >
          {children}
        </ul>
      )}
    </div>
  );
}

interface PanelDropdownOptionProps {
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

export function PanelDropdownOption({
  isSelected,
  onSelect,
  children,
}: PanelDropdownOptionProps) {
  return (
    <li role="option" aria-selected={isSelected}>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center gap-4xs px-3xs py-4xs text-left hover:bg-bg-light ${
          isSelected ? "bg-bg-light" : ""
        }`}
      >
        {children}
      </button>
    </li>
  );
}
