import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Checkbox } from "../ui/Checkbox";
import type { LeadershipTender, TenderOwner } from "../../types/tender";
import type { VoteType } from "../../utils/applyVote";
import { statusLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { QualificationCell } from "./QualificationCell";
import { TeamCell } from "./TeamCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import type { StatusFilterProps } from "./StatusColumnHeader";
import { StatusColumnHeader } from "./StatusColumnHeader";
import { getTdClass, tableClass, tableWrapperClass, thClass } from "./tableStyles";

interface LeadershipTendersTableProps extends TableSelectionProps, StatusFilterProps {
  tenders: LeadershipTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: LeadershipTender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onTeamChange: (tenderId: string, team: string) => void;
  onVote?: (
    tenderId: string,
    type: VoteType,
    qualification: LeadershipTender["qualification"],
  ) => void;
}

export function LeadershipTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onTeamChange,
  onVote,
  selectedStatuses,
  onStatusToggle,
  isRowSelected,
  onRowSelectedChange,
}: LeadershipTendersTableProps) {
  return (
    <div className={tableWrapperClass}>
      <table className={`${tableClass} min-w-[1100px]`}>
        <thead>
          <tr>
            <th scope="col" className={`${thClass} w-[52px]`}>
              <span className="sr-only">Auswählen</span>
            </th>
            <th scope="col" className={`${thClass} min-w-[198px]`}>
              Name
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              <StatusColumnHeader
                selectedStatuses={selectedStatuses}
                onStatusToggle={onStatusToggle}
              />
            </th>
            <th scope="col" className={`${thClass} w-[136px]`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} w-[180px]`}>
              Volumen
            </th>
            <th scope="col" className={`${thClass} w-[173px]`}>
              Qualifikation
            </th>
            <th scope="col" className={`${thClass} w-[168px]`}>
              Projekt Owner
            </th>
            <th scope="col" className={`${thClass} w-[100px] border-r-0`}>
              Team
            </th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <LeadershipTenderRow
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
              onVote={(type) =>
                onVote?.(tender.id, type, tender.qualification)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadershipTenderRow({
  tender,
  isActive,
  isSelected,
  onSelectedChange,
  onOpen,
  onOwnerChange,
  onTeamChange,
  onVote,
}: {
  tender: LeadershipTender;
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onTeamChange: (team: string) => void;
  onVote?: (type: VoteType) => void;
}) {
  const isHighlighted = isSelected || isActive;
  const cellClass = (extra?: string) => getTdClass(isHighlighted, extra);

  return (
    <tr className="group cursor-pointer" onClick={onOpen}>
      <td
        className={cellClass()}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={onSelectedChange}
          label={`${tender.name} auswählen`}
        />
      </td>
      <td className={cellClass()}>
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
        <Badge variant={statusToVariant(tender.status)}>
          {statusLabels[tender.status]}
        </Badge>
      </td>
      <td className={cellClass()}>
        <div className="flex flex-col gap-3xs">
          <DeadlineUrgencyText deadline={tender.deadline} urgency={tender.urgency} />
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={cellClass()}>
        <span className="break-words text-table text-text-primary">
          {tender.volumen}
        </span>
      </td>
      <td className={cellClass()}>
        <QualificationCell
          qualification={tender.qualification}
          onVote={(type) => onVote?.(type)}
        />
      </td>
      <td className={cellClass()}>
        <ProjectOwnerCell
          owner={tender.owner}
          onOwnerChange={onOwnerChange}
        />
      </td>
      <td className={cellClass("border-r-0")}>
        <TeamCell team={tender.team} onTeamChange={onTeamChange} />
      </td>
    </tr>
  );
}

function DeadlineText({ deadline }: { deadline: string }) {
  const [date, time] = deadline.split(" | ");

  return (
    <span className="whitespace-nowrap text-table text-text-primary">
      {date}
      <span className="text-border-dark"> | </span>
      {time}
    </span>
  );
}
