import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  Filter,
  ListChecks,
  MapPin,
  Star,
  Upload,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { panelUsers } from "../../data/mockTenders";
import type { TenderOwner } from "../../types/tender";
import { Avatar } from "../ui/Avatar";
import { withIconClass } from "../ui/iconProps";
import {
  DROPDOWN_GAP_PX,
  DROPDOWN_Z_INDEX,
  getFixedDropdownMenuStyle,
  useFixedDropdownStyle,
} from "./useFixedDropdownStyle";

const OWNER_FILTER_ID = "owner";
const SUBMENU_HOVER_DELAY_MS = 120;

const filterOptions: Array<{
  id: string;
  icon: LucideIcon;
  label: string;
  hasSubmenu?: boolean;
}> = [
  { id: "location", icon: MapPin, label: "Ort" },
  { id: "deadline", icon: Calendar, label: "Abgabefrist" },
  { id: "buyer", icon: Briefcase, label: "Buyer" },
  { id: "service-type", icon: ListChecks, label: "Leistungsart" },
  { id: "building-type", icon: Building2, label: "Gebäudetyp" },
  { id: OWNER_FILTER_ID, icon: User, label: "Projekt Owner", hasSubmenu: true },
  { id: "team", icon: Users, label: "Team" },
  { id: "procedure-type", icon: FileText, label: "Verfahrensart" },
  { id: "upload-date", icon: Upload, label: "Upload-Datum" },
  { id: "relevance-score", icon: Star, label: "Relevanz-Score" },
  { id: "complexity-score", icon: Activity, label: "Komplexität-Score" },
];

interface FilterDropdownProps {
  onOwnerFilterSelect: (owner: TenderOwner) => void;
}

export function FilterDropdown({ onOwnerFilterSelect }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [ownerSubmenuStyle, setOwnerSubmenuStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const ownerItemRef = useRef<HTMLDivElement>(null);
  const ownerSubmenuRef = useRef<HTMLUListElement>(null);
  const submenuHoverTimeoutRef = useRef<number | null>(null);
  const menuStyle = useFixedDropdownStyle(isOpen, buttonRef, menuRef, "left", {
    capMaxHeight: false,
  });

  const clearSubmenuHoverTimeout = useCallback(() => {
    if (submenuHoverTimeoutRef.current !== null) {
      window.clearTimeout(submenuHoverTimeoutRef.current);
      submenuHoverTimeoutRef.current = null;
    }
  }, []);

  const openOwnerSubmenu = useCallback(() => {
    clearSubmenuHoverTimeout();
    setOpenSubmenuId(OWNER_FILTER_ID);
  }, [clearSubmenuHoverTimeout]);

  const scheduleCloseOwnerSubmenu = useCallback(() => {
    clearSubmenuHoverTimeout();
    submenuHoverTimeoutRef.current = window.setTimeout(() => {
      setOpenSubmenuId((current) =>
        current === OWNER_FILTER_ID ? null : current,
      );
    }, SUBMENU_HOVER_DELAY_MS);
  }, [clearSubmenuHoverTimeout]);

  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenuId(null);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target) ||
        ownerSubmenuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (openSubmenuId !== OWNER_FILTER_ID || !ownerItemRef.current) {
      setOwnerSubmenuStyle(null);
      return;
    }

    const updatePosition = () => {
      const rect = ownerItemRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      setOwnerSubmenuStyle({
        top: rect.top,
        left: rect.right + DROPDOWN_GAP_PX,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openSubmenuId, menuStyle]);

  useEffect(() => {
    return () => {
      clearSubmenuHoverTimeout();
    };
  }, [clearSubmenuHoverTimeout]);

  const handleOwnerSelect = (owner: TenderOwner) => {
    onOwnerFilterSelect(owner);
    setIsOpen(false);
    setOpenSubmenuId(null);
  };

  const ownerSubmenu =
    isOpen && openSubmenuId === OWNER_FILTER_ID && ownerSubmenuStyle ? (
      <ul
        ref={ownerSubmenuRef}
        role="listbox"
        aria-label="Projekt Owner"
        style={{
          position: "fixed",
          top: ownerSubmenuStyle.top,
          left: ownerSubmenuStyle.left,
          zIndex: DROPDOWN_Z_INDEX + 1,
        }}
        className="w-max rounded-[2px] border border-border-light bg-bg-containers py-4xs"
        onMouseEnter={openOwnerSubmenu}
        onMouseLeave={scheduleCloseOwnerSubmenu}
      >
        {panelUsers.map((owner) => (
          <li key={owner.name} role="option">
            <button
              type="button"
              onClick={() => handleOwnerSelect(owner)}
              className="flex w-full items-center gap-4xs px-3xs py-4xs text-left hover:bg-bg-light"
            >
              <Avatar
                name={owner.name}
                initials={owner.initials}
                color={owner.color}
                avatarUrl={owner.avatarUrl}
              />
              <span className="whitespace-nowrap text-table text-text-primary">
                {owner.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  const menu =
    isOpen && menuStyle ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label="Filter"
        style={getFixedDropdownMenuStyle(menuStyle)}
        className="w-max overflow-visible rounded-[2px] border border-border-light bg-bg-containers py-4xs"
      >
        {filterOptions.map(({ id, icon: Icon, label, hasSubmenu }) =>
          hasSubmenu ? (
            <li key={id} role="option">
              <div
                ref={id === OWNER_FILTER_ID ? ownerItemRef : undefined}
                onMouseEnter={openOwnerSubmenu}
                onMouseLeave={scheduleCloseOwnerSubmenu}
                className={`flex w-full items-center justify-between gap-xs px-3xs py-4xs ${
                  openSubmenuId === id ? "bg-bg-light" : "hover:bg-bg-light"
                }`}
              >
                <span className="flex items-center gap-4xs">
                  <Icon {...withIconClass()} />
                  <span className="whitespace-nowrap text-table text-text-primary">
                    {label}
                  </span>
                </span>
                <ChevronRight {...withIconClass("shrink-0")} />
              </div>
            </li>
          ) : (
            <li key={id} role="option">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-between gap-xs px-3xs py-4xs text-left hover:bg-bg-light"
              >
                <span className="flex items-center gap-4xs">
                  <Icon {...withIconClass()} />
                  <span className="whitespace-nowrap text-table text-text-primary">
                    {label}
                  </span>
                </span>
                <ChevronRight {...withIconClass("shrink-0")} />
              </button>
            </li>
          ),
        )}
      </ul>
    ) : null;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter"
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex items-center gap-3xs text-filter-label transition-colors ${
          isOpen
            ? "text-text-accent"
            : "text-text-primary hover:text-text-accent"
        }`}
      >
        <Filter {...withIconClass()} />
        Filter
      </button>

      {menu && createPortal(menu, document.body)}
      {ownerSubmenu && createPortal(ownerSubmenu, document.body)}
    </div>
  );
}
