import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { DeadlineText } from "./DeadlineText";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { TeamTender, TenderOwner, TenderDecision } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { DecisionCell } from "./DecisionCell";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { TeamCell } from "./TeamCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import type { StatusFilterProps } from "./StatusColumnHeader";
import { StatusColumnHeader } from "./StatusColumnHeader";
import { getTdClass, deadlineColumnClass, selectColumnClass, teamDecisionCellClass, teamDecisionColumnClass, teamNameColumnClass, teamProjectOwnerColumnClass, teamStatusColumnClass, teamTeamColumnClass, teamUpdatesColumnClass, tableClass, tableWrapperClass, thClass } from "./tableStyles";

interface TeamTendersTableProps extends TableSelectionProps, StatusFilterProps {
  tenders: TeamTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: TeamTender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onTeamChange: (tenderId: string, team: string) => void;
  onDecisionChange: (tenderId: string, decision: TenderDecision) => void;
}

export function TeamTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onTeamChange,
  onDecisionChange,
  selectedStatuses,
  onStatusToggle,
  isRowSelected,
  onRowSelectedChange,
}: TeamTendersTableProps) {
  return (
    <div className={tableWrapperClass}>
      <table className={`${tableClass} min-w-[1316.21px]`}>
        <thead>
          <tr>
            <th scope="col" className={`${thClass} ${selectColumnClass}`}>
              <span className="sr-only">Auswählen</span>
            </th>
            <th scope="col" className={`${thClass} ${teamNameColumnClass}`}>
              Name
            </th>
            <th scope="col" className={`${thClass} w-[135px]`}>
              Leistungsart
            </th>
            <th scope="col" className={`${thClass} w-[88px]`}>
              LP
            </th>
            <th scope="col" className={`${thClass} ${teamStatusColumnClass}`}>
              <StatusColumnHeader
                selectedStatuses={selectedStatuses}
                onStatusToggle={onStatusToggle}
              />
            </th>
            <th scope="col" className={`${thClass} ${deadlineColumnClass}`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} ${teamUpdatesColumnClass}`}>
              Aktualisierungen
            </th>
            <th scope="col" className={`${thClass} ${teamProjectOwnerColumnClass}`}>
              Projekt Owner
            </th>
            <th scope="col" className={`${thClass} ${teamTeamColumnClass}`}>
              Team
            </th>
            <th scope="col" className={`${thClass} ${teamDecisionColumnClass} border-r-0`}>
              Entscheidung
            </th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <TeamTenderRow
              key={tender.id}
              tender={tender}
              isActive={activeTenderId === tender.id}
              isSelected={isRowSelected(tender.id)}
              onSelectedChange={(checked) =>
                onRowSelectedChange(tender.id, checked)
              }
              onOpen={() => onTenderOpen(tender)}
              onOwnerChange={(owner) => onOwnerChange(tender.id, owner)}
              onTeamChange={(team) => onTeamChange(tender.id, team)}
              onDecisionChange={(decision) =>
                onDecisionChange(tender.id, decision)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamTenderRow({
  tender,
  isActive,
  isSelected,
  onSelectedChange,
  onOpen,
  onOwnerChange,
  onTeamChange,
  onDecisionChange,
}: {
  tender: TeamTender;
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onTeamChange: (team: string) => void;
  onDecisionChange: (decision: TenderDecision) => void;
}) {
  const isHighlighted = isSelected || isActive;
  const cellClass = (extra?: string) => getTdClass(isHighlighted, extra);

  return (
    <tr className="group cursor-pointer" onClick={onOpen}>
      <td
        className={cellClass(selectColumnClass)}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={onSelectedChange}
          label={`${tender.name} auswählen`}
        />
      </td>
      <td className={cellClass(teamNameColumnClass)}>
        <div className="flex flex-col gap-4xs break-words">
          <span className="text-tender-title text-text-primary">
            {tender.name}
          </span>
          <span className="text-small text-text-secondary">
            {tender.location}
          </span>
        </div>
      </td>
      <td className={cellClass()}>
        <span className="line-clamp-3 min-w-0 break-words text-table text-text-primary">
          {tender.leistungsart}
        </span>
      </td>
      <td className={cellClass()}>
        <span className="line-clamp-2 min-w-0 break-words text-table text-text-primary">
          {tender.lp}
        </span>
      </td>
      <td className={cellClass(teamStatusColumnClass)}>
        <Badge
          variant={statusToVariant(tender.status)}
          className="max-w-full whitespace-normal"
        >
          {statusLabels[tender.status]}
        </Badge>
      </td>
      <td className={cellClass(deadlineColumnClass)}>
        <div className="flex flex-col gap-3xs">
          <DeadlineUrgencyText deadline={tender.deadline} urgency={tender.urgency} />
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={cellClass(teamUpdatesColumnClass)}>
        <UpdatesCell update={tender.update} />
      </td>
      <td className={cellClass(teamProjectOwnerColumnClass)}>
        <ProjectOwnerCell
          owner={tender.owner}
          onOwnerChange={onOwnerChange}
        />
      </td>
      <td className={cellClass(teamTeamColumnClass)}>
        <TeamCell team={tender.team} onTeamChange={onTeamChange} />
      </td>
      <td className={cellClass(`${teamDecisionCellClass} border-r-0`)}>
        <DecisionCell
          decision={tender.decision}
          status={tender.status}
          onDecisionChange={onDecisionChange}
        />
      </td>
    </tr>
  );
}

function UpdatesCell({ update }: { update: TeamTender["update"] }) {
  if (!update) {
    return <span className="text-table text-text-primary">Unbekannt</span>;
  }

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3xs overflow-hidden">
      <div className="flex min-w-0 items-start gap-3xs">
        <UpdateDot isNew={update.isNew} />
        <span
          className={`line-clamp-2 min-w-0 break-words text-table ${update.isNew ? "text-text-primary" : "text-text-secondary"}`}
        >
          {update.title}
        </span>
      </div>
      <TextLink>Alle anzeigen</TextLink>
    </div>
  );
}

function UpdateDot({ isNew }: { isNew: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-[6px] size-2 shrink-0 rounded-full ${isNew ? "bg-status-info-text" : "bg-text-disabled"}`}
    />
  );
}
