import { ChevronDown, Square, SquareCheck, SquareMinus } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { panelTeams, panelUsers } from "../../data/mockTenders";
import type { TenderOwner } from "../../types/tender";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { withIconClass } from "../ui/iconProps";

interface BulkSelectionActionBarProps {
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onToggleAll: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onTeamChange: (team: string) => void;
  onMarkUpdatesReadChange: (markAsRead: boolean) => void;
  selectedIdsKey: string;
}

export function BulkSelectionActionBar({
  allSelected,
  someSelected,
  onSelectAll,
  onSelectNone,
  onToggleAll,
  onOwnerChange,
  onTeamChange,
  onMarkUpdatesReadChange,
  selectedIdsKey,
}: BulkSelectionActionBarProps) {
  const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [markReadChecked, setMarkReadChecked] = useState(false);
  const selectionRef = useRef<HTMLDivElement>(null);
  const ownerRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMarkReadChecked(false);
  }, [selectedIdsKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectionRef.current &&
        !selectionRef.current.contains(event.target as Node)
      ) {
        setSelectionMenuOpen(false);
      }
      if (ownerRef.current && !ownerRef.current.contains(event.target as Node)) {
        setOwnerMenuOpen(false);
      }
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) {
        setTeamMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SelectionIcon = allSelected ? SquareCheck : someSelected ? SquareMinus : Square;

  const handleMarkReadChange = (checked: boolean) => {
    setMarkReadChecked(checked);
    onMarkUpdatesReadChange(checked);
  };

  return (
    <div className="flex items-center gap-l px-xs">
      <div ref={selectionRef} className="relative flex items-center gap-4xs">
        <button
          type="button"
          aria-label={
            allSelected
              ? "Alle Zeilen abwählen"
              : someSelected
                ? "Alle Zeilen auswählen"
                : "Alle Zeilen auswählen"
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={onToggleAll}
          className="inline-flex cursor-pointer items-center"
        >
          <SelectionIcon
            {...withIconClass(
              allSelected || someSelected ? "text-icon-selected" : undefined,
            )}
          />
        </button>

        <button
          type="button"
          aria-expanded={selectionMenuOpen}
          aria-haspopup="listbox"
          aria-label="Auswahloptionen"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setSelectionMenuOpen((current) => !current)}
          className="inline-flex cursor-pointer items-center"
        >
          <ChevronDown
            {...withIconClass(
              `transition-transform ${selectionMenuOpen ? "rotate-180" : ""}`,
            )}
          />
        </button>

        {selectionMenuOpen && (
          <ul
            role="listbox"
            aria-label="Auswahloptionen"
            className="absolute left-0 top-full z-10 mt-4xs min-w-[120px] rounded-[2px] border border-border-light bg-bg-containers py-4xs"
          >
            <li role="option">
              <button
                type="button"
                onClick={() => {
                  onSelectAll();
                  setSelectionMenuOpen(false);
                }}
                className="flex w-full px-3xs py-4xs text-left text-table text-text-primary hover:bg-bg-light"
              >
                All
              </button>
            </li>
            <li role="option">
              <button
                type="button"
                onClick={() => {
                  onSelectNone();
                  setSelectionMenuOpen(false);
                }}
                className="flex w-full px-3xs py-4xs text-left text-table text-text-primary hover:bg-bg-light"
              >
                None
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3xs">
        <span className="text-filter-label font-light text-text-primary">
          Projekt Owner:
        </span>
        <BulkActionDropdown
          containerRef={ownerRef}
          isOpen={ownerMenuOpen}
          onToggle={() => setOwnerMenuOpen((current) => !current)}
          ariaLabel="Projekt Owner für ausgewählte Zeilen"
          placeholder="Wählen"
        >
          {panelUsers.map((user) => (
            <li key={user.name} role="option">
              <button
                type="button"
                onClick={() => {
                  onOwnerChange(user);
                  setOwnerMenuOpen(false);
                }}
                className="flex w-full items-center gap-4xs px-3xs py-4xs text-left hover:bg-bg-light"
              >
                <Avatar
                  name={user.name}
                  initials={user.initials}
                  color={user.color}
                  avatarUrl={user.avatarUrl}
                />
                <span className="min-w-0 flex-1 truncate text-table text-text-primary">
                  {user.name}
                </span>
              </button>
            </li>
          ))}
        </BulkActionDropdown>
      </div>

      <div className="flex items-center gap-3xs">
        <span className="text-filter-label font-light text-text-primary">
          Team:
        </span>
        <BulkActionDropdown
          containerRef={teamRef}
          isOpen={teamMenuOpen}
          onToggle={() => setTeamMenuOpen((current) => !current)}
          ariaLabel="Team für ausgewählte Zeilen"
          placeholder="Wählen"
        >
          {panelTeams.map((team) => (
            <li key={team} role="option">
              <button
                type="button"
                onClick={() => {
                  onTeamChange(team);
                  setTeamMenuOpen(false);
                }}
                className="flex w-full px-3xs py-4xs text-left text-table text-text-primary hover:bg-bg-light"
              >
                {team}
              </button>
            </li>
          ))}
        </BulkActionDropdown>
      </div>

      <div className="inline-flex items-center gap-3xs">
        <Checkbox
          checked={markReadChecked}
          onChange={handleMarkReadChange}
          label="Aktualisierungen als gelesen markieren"
        />
        <span className="text-table text-text-primary">
          Aktualisierungen als gelesen markieren
        </span>
      </div>
    </div>
  );
}

function BulkActionDropdown({
  containerRef,
  isOpen,
  onToggle,
  ariaLabel,
  placeholder,
  children,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onToggle: () => void;
  ariaLabel: string;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <div ref={containerRef} className="relative w-[165px]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4xs rounded-[2px] border border-border-light bg-bg-containers px-3xs py-4xs text-left"
      >
        <span className="min-w-0 flex-1 truncate text-table text-text-primary">
          {placeholder}
        </span>
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
