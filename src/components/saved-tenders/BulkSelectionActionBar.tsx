import { ChevronDown, Square, SquareCheck, SquareMinus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { panelTeams, panelUsers } from "../../data/mockTenders";
import type { TenderOwner } from "../../types/tender";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { withIconClass } from "../ui/iconProps";
import { PanelDropdown, PanelDropdownOption } from "./PanelDropdown";
import {
  getFixedDropdownMenuStyle,
  useFixedDropdownStyle,
} from "./useFixedDropdownStyle";

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
  const selectionButtonRef = useRef<HTMLButtonElement>(null);
  const selectionMenuRef = useRef<HTMLUListElement>(null);
  const selectionMenuStyle = useFixedDropdownStyle(
    selectionMenuOpen,
    selectionButtonRef,
    selectionMenuRef,
  );

  useEffect(() => {
    setMarkReadChecked(false);
  }, [selectedIdsKey]);

  useEffect(() => {
    if (!selectionMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        selectionRef.current?.contains(target) ||
        selectionMenuRef.current?.contains(target)
      ) {
        return;
      }

      setSelectionMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectionMenuOpen]);

  const SelectionIcon = allSelected ? SquareCheck : someSelected ? SquareMinus : Square;

  const handleMarkReadChange = (checked: boolean) => {
    setMarkReadChecked(checked);
    onMarkUpdatesReadChange(checked);
  };

  const preventFocusSteal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const selectionMenu =
    selectionMenuOpen && selectionMenuStyle ? (
      <ul
        ref={selectionMenuRef}
        role="listbox"
        aria-label="Auswahloptionen"
        style={getFixedDropdownMenuStyle(selectionMenuStyle)}
        className="w-max overflow-y-auto rounded-[2px] border border-border-light bg-bg-containers py-4xs"
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
    ) : null;

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
          onMouseDown={preventFocusSteal}
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
          ref={selectionButtonRef}
          type="button"
          aria-expanded={selectionMenuOpen}
          aria-haspopup="listbox"
          aria-label="Auswahloptionen"
          onMouseDown={preventFocusSteal}
          onClick={() => setSelectionMenuOpen((current) => !current)}
          className="inline-flex cursor-pointer items-center"
        >
          <ChevronDown
            {...withIconClass(
              `transition-transform ${selectionMenuOpen ? "rotate-180" : ""}`,
            )}
          />
        </button>

        {selectionMenu && createPortal(selectionMenu, document.body)}
      </div>

      <div className="flex items-center gap-3xs">
        <span className="text-filter-label font-light text-text-primary">
          Projekt Owner:
        </span>
        <div className="w-[165px]">
          <PanelDropdown
            isOpen={ownerMenuOpen}
            onToggle={() => setOwnerMenuOpen((current) => !current)}
            onClose={() => setOwnerMenuOpen(false)}
            onTriggerMouseDown={preventFocusSteal}
            ariaLabel="Projekt Owner für ausgewählte Zeilen"
            trigger={
              <span className="truncate text-table text-text-primary">
                Wählen
              </span>
            }
          >
            {panelUsers.map((user) => (
              <PanelDropdownOption
                key={user.name}
                isSelected={false}
                onSelect={() => {
                  onOwnerChange(user);
                  setOwnerMenuOpen(false);
                }}
              >
                <Avatar
                  name={user.name}
                  initials={user.initials}
                  color={user.color}
                  avatarUrl={user.avatarUrl}
                />
                <span className="min-w-0 flex-1 whitespace-nowrap text-table text-text-primary">
                  {user.name}
                </span>
              </PanelDropdownOption>
            ))}
          </PanelDropdown>
        </div>
      </div>

      <div className="flex items-center gap-3xs">
        <span className="text-filter-label font-light text-text-primary">
          Team:
        </span>
        <div className="w-[165px]">
          <PanelDropdown
            isOpen={teamMenuOpen}
            onToggle={() => setTeamMenuOpen((current) => !current)}
            onClose={() => setTeamMenuOpen(false)}
            onTriggerMouseDown={preventFocusSteal}
            ariaLabel="Team für ausgewählte Zeilen"
            trigger={
              <span className="truncate text-table text-text-primary">
                Wählen
              </span>
            }
          >
            {panelTeams.map((team) => (
              <PanelDropdownOption
                key={team}
                isSelected={false}
                onSelect={() => {
                  onTeamChange(team);
                  setTeamMenuOpen(false);
                }}
              >
                <span className="whitespace-nowrap text-table text-text-primary">
                  {team}
                </span>
              </PanelDropdownOption>
            ))}
          </PanelDropdown>
        </div>
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
