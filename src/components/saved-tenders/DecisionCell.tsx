import { Check, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { decisionLabels, decisionOptions } from "../../data/decisionOptions";
import type { TenderDecision, TenderStatus } from "../../types/tender";
import { withIconClass } from "../ui/iconProps";
import { PanelDropdown, PanelDropdownOption } from "./PanelDropdown";

const decisionOptionMeta: Record<
  TenderDecision,
  { Icon: LucideIcon; iconClassName: string }
> = {
  "abgabe-geplant": {
    Icon: Check,
    iconClassName: "text-scoring-high",
  },
  aussortiert: {
    Icon: X,
    iconClassName: "text-scoring-low",
  },
};

function resolveDecision(
  decision: TenderDecision | null | undefined,
  status: TenderStatus,
): TenderDecision | null {
  if (status === "aussortiert") {
    return "aussortiert";
  }

  return decision ?? null;
}

function DecisionOptionContent({ decision }: { decision: TenderDecision }) {
  const { Icon, iconClassName } = decisionOptionMeta[decision];

  return (
    <>
      <Icon {...withIconClass(iconClassName)} size={16} />
      <span className="min-w-0 flex-1 text-table text-text-primary">
        {decisionLabels[decision]}
      </span>
    </>
  );
}

interface DecisionCellProps {
  decision?: TenderDecision | null;
  status: TenderStatus;
  onDecisionChange: (decision: TenderDecision) => void;
}

export function DecisionCell({
  decision,
  status,
  onDecisionChange,
}: DecisionCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDecision = resolveDecision(decision, status);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <PanelDropdown
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
        onClose={() => setIsOpen(false)}
        ariaLabel="Entscheidung auswählen"
        trigger={
          selectedDecision ? (
            <DecisionOptionContent decision={selectedDecision} />
          ) : (
            <span className="text-table text-text-secondary">Auswählen</span>
          )
        }
      >
        {decisionOptions.map((option) => (
          <PanelDropdownOption
            key={option.value}
            isSelected={selectedDecision === option.value}
            onSelect={() => {
              onDecisionChange(option.value);
              setIsOpen(false);
            }}
          >
            <DecisionOptionContent decision={option.value} />
          </PanelDropdownOption>
        ))}
      </PanelDropdown>
    </div>
  );
}
