import { ChevronDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { withIconClass } from "../ui/iconProps";
import {
  DROPDOWN_Z_INDEX,
  getFixedDropdownMenuStyle,
  useFixedDropdownStyle,
} from "./useFixedDropdownStyle";

interface PanelDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  ariaLabel: string;
  trigger: ReactNode;
  children: ReactNode;
  menuZIndex?: number;
  onTriggerMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PanelDropdown({
  isOpen,
  onToggle,
  onClose,
  ariaLabel,
  trigger,
  children,
  menuZIndex = DROPDOWN_Z_INDEX,
  onTriggerMouseDown,
}: PanelDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useFixedDropdownStyle(isOpen, buttonRef, menuRef);

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

      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menu = isOpen ? (
    <ul
      ref={menuRef}
      role="listbox"
      aria-label={ariaLabel}
      style={
        menuStyle
          ? getFixedDropdownMenuStyle(menuStyle, menuZIndex)
          : {
              position: "fixed",
              visibility: "hidden",
              top: 0,
              left: 0,
              zIndex: menuZIndex,
            }
      }
      className="w-max overflow-y-auto rounded-[2px] border border-border-light bg-bg-containers py-4xs"
    >
      {children}
    </ul>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onMouseDown={onTriggerMouseDown}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4xs rounded-[2px] border border-border-light bg-bg-containers px-3xs py-4xs text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4xs">{trigger}</div>
        <ChevronDown
          {...withIconClass(`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`)}
        />
      </button>

      {menu && createPortal(menu, document.body)}
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
