import { useState } from "react";
import { panelTeams } from "../../data/mockTenders";
import { PanelDropdown, PanelDropdownOption } from "./PanelDropdown";

interface TeamCellProps {
  team: string;
  onTeamChange: (team: string) => void;
}

export function TeamCell({ team, onTeamChange }: TeamCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <PanelDropdown
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
        onClose={() => setIsOpen(false)}
        ariaLabel="Team auswählen"
        trigger={
          <span className="min-w-0 flex-1 text-table text-text-primary">
            {team}
          </span>
        }
      >
        {panelTeams.map((option) => (
          <PanelDropdownOption
            key={option}
            isSelected={team === option}
            onSelect={() => {
              onTeamChange(option);
              setIsOpen(false);
            }}
          >
            <span className="text-table text-text-primary">{option}</span>
          </PanelDropdownOption>
        ))}
      </PanelDropdown>
    </div>
  );
}
