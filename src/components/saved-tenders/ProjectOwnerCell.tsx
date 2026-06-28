import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { panelUsers } from "../../data/mockTenders";
import type { TenderOwner } from "../../types/tender";
import { PanelDropdown, PanelDropdownOption } from "./PanelDropdown";

interface ProjectOwnerCellProps {
  owner: TenderOwner | null;
  onOwnerChange: (owner: TenderOwner) => void;
}

export function ProjectOwnerCell({
  owner,
  onOwnerChange,
}: ProjectOwnerCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <PanelDropdown
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
        onClose={() => setIsOpen(false)}
        ariaLabel="Projekt Owner auswählen"
        trigger={
          owner ? (
            <>
              <Avatar initials={owner.initials} color={owner.color} />
              <span className="min-w-0 flex-1 whitespace-nowrap text-table text-text-primary">
                {owner.name}
              </span>
            </>
          ) : (
            <span className="text-table text-text-secondary">Unbekannt</span>
          )
        }
      >
        {panelUsers.map((user) => (
          <PanelDropdownOption
            key={user.name}
            isSelected={owner?.name === user.name}
            onSelect={() => {
              onOwnerChange(user);
              setIsOpen(false);
            }}
          >
            <Avatar initials={user.initials} color={user.color} />
            <span className="min-w-0 flex-1 truncate text-table text-text-primary">
              {user.name}
            </span>
          </PanelDropdownOption>
        ))}
      </PanelDropdown>
    </div>
  );
}
