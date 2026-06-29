import { useState } from "react";
import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Checkbox } from "../ui/Checkbox";
import type { LeadershipTender, TenderOwner } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { QualificationCell } from "./QualificationCell";
import { TeamCell } from "./TeamCell";
import { getTdClass, thClass } from "./tableStyles";

interface LeadershipTendersTableProps {
  tenders: LeadershipTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: LeadershipTender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onTeamChange: (tenderId: string, team: string) => void;
  onQualificationChange?: (
    tenderId: string,
    qualification: LeadershipTender["qualification"],
  ) => void;
}

export function LeadershipTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onTeamChange,
  onQualificationChange,
}: LeadershipTendersTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-container border border-border-dark">
      <table className="w-full min-w-[1100px] border-collapse">
        <thead>
          <tr>
            <th scope="col" className={`${thClass} w-[52px]`}>
              <span className="sr-only">Auswählen</span>
            </th>
            <th scope="col" className={`${thClass} min-w-[198px]`}>
              Name
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              Status
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
              onOpen={() => onTenderOpen(tender)}
              onOwnerChange={(owner) => onOwnerChange(tender.id, owner)}
              onTeamChange={(team) => onTeamChange(tender.id, team)}
              onQualificationChange={(qualification) =>
                onQualificationChange?.(tender.id, qualification)
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
  onOpen,
  onOwnerChange,
  onTeamChange,
  onQualificationChange,
}: {
  tender: LeadershipTender;
  isActive: boolean;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onTeamChange: (team: string) => void;
  onQualificationChange?: (
    qualification: LeadershipTender["qualification"],
  ) => void;
}) {
  const [selected, setSelected] = useState(false);
  const isHighlighted = selected || isActive;
  const cellClass = (extra?: string) => getTdClass(isHighlighted, extra);

  return (
    <tr className="group cursor-pointer" onClick={onOpen}>
      <td
        className={cellClass()}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onChange={setSelected}
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
          tenderId={tender.id}
          qualification={tender.qualification}
          onQualificationChange={onQualificationChange}
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
