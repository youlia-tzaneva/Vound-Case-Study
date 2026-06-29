import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { TeamTender, TenderOwner } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { TeamCell } from "./TeamCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import { getTdClass, tableClass, tableWrapperClass, thClass } from "./tableStyles";

interface TeamTendersTableProps extends TableSelectionProps {
  tenders: TeamTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: TeamTender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onTeamChange: (tenderId: string, team: string) => void;
}

export function TeamTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onTeamChange,
  isRowSelected,
  onRowSelectedChange,
}: TeamTendersTableProps) {
  return (
    <div className={tableWrapperClass}>
      <table className={`${tableClass} table-fixed`}>
        <thead>
          <tr>
            <th scope="col" className={`${thClass} w-[52px]`}>
              <span className="sr-only">Auswählen</span>
            </th>
            <th scope="col" className={`${thClass} w-[198px]`}>
              Name
            </th>
            <th scope="col" className={`${thClass} w-[135px]`}>
              Leistungsart
            </th>
            <th scope="col" className={`${thClass} w-[88px]`}>
              LP
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              Status
            </th>
            <th scope="col" className={`${thClass} w-[136px]`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} w-[calc(100%-1085px)]`}>
              Aktualisierungen
            </th>
            <th scope="col" className={`${thClass} w-[168px]`}>
              Projekt Owner
            </th>
            <th scope="col" className={`${thClass} w-[132px] border-r-0`}>
              Team
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
}: {
  tender: TeamTender;
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onTeamChange: (team: string) => void;
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
        <span className="line-clamp-3 min-w-0 break-words text-table text-text-primary">
          {tender.leistungsart}
        </span>
      </td>
      <td className={cellClass()}>
        <span className="line-clamp-2 min-w-0 break-words text-table text-text-primary">
          {tender.lp}
        </span>
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
        <UpdatesCell update={tender.update} />
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

function UpdatesCell({ update }: { update: TeamTender["update"] }) {
  if (!update) {
    return <span className="text-table text-text-primary">Unbekannt</span>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-3xs">
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
