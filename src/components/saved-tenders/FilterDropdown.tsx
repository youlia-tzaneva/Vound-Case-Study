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
import { useEffect, useRef, useState } from "react";
import { panelUsers } from "../../data/mockTenders";
import type { TenderOwner } from "../../types/tender";
import { Avatar } from "../ui/Avatar";
import { withIconClass } from "../ui/iconProps";

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
  { id: "owner", icon: User, label: "Projekt Owner", hasSubmenu: true },
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenuId(null);
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

  const handleOwnerSelect = (owner: TenderOwner) => {
    onOwnerFilterSelect(owner);
    setIsOpen(false);
    setOpenSubmenuId(null);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
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

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Filter"
          className="absolute left-0 top-full z-10 mt-4xs w-max min-w-full rounded-[2px] border border-border-light bg-bg-containers py-4xs"
        >
          {filterOptions.map(({ id, icon: Icon, label, hasSubmenu }) =>
            hasSubmenu ? (
              <li
                key={id}
                role="option"
                className="relative"
                onMouseEnter={() => setOpenSubmenuId(id)}
                onMouseLeave={() => setOpenSubmenuId(null)}
              >
                <div
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

                {openSubmenuId === id && (
                  <div className="absolute left-full top-0 pl-4xs">
                    <ul
                      role="listbox"
                      aria-label="Projekt Owner"
                      className="w-max rounded-[2px] border border-border-light bg-bg-containers py-4xs"
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
                  </div>
                )}
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
      )}
    </div>
  );
}
