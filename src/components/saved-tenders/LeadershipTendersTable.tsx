import { useState } from "react";
import { Badge, statusToVariant, urgencyToVariant } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import type { LeadershipTender } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { getTdClass, thClass } from "./tableStyles";

interface LeadershipTendersTableProps {
  tenders: LeadershipTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: LeadershipTender) => void;
}

export function LeadershipTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
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
            <th scope="col" className={`${thClass} w-[138px]`}>
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
}: {
  tender: LeadershipTender;
  isActive: boolean;
  onOpen: () => void;
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
          {tender.urgency && tender.urgencyLabel && (
            <Badge variant={urgencyToVariant(tender.urgency)}>
              {tender.urgencyLabel}
            </Badge>
          )}
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={cellClass()}>
        <span className="break-words text-table text-text-primary">
          {tender.volumen}
        </span>
      </td>
      <td className={cellClass()}>
        <QualificationCell qualification={tender.qualification} />
      </td>
      <td className={cellClass()}>
        <div className="flex items-start gap-3xs">
          <Avatar
            initials={tender.owner.initials}
            color={tender.owner.color}
          />
          <span className="text-table text-text-primary">
            {tender.owner.name}
          </span>
        </div>
      </td>
      <td className={cellClass("border-r-0")}>
        <span className="text-table text-text-primary">{tender.team}</span>
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

function QualificationCell({
  qualification,
}: {
  qualification: LeadershipTender["qualification"];
}) {
  return (
    <div className="flex flex-col gap-3xs whitespace-nowrap">
      <div className="flex items-center justify-between gap-xs">
        <span>Votes:</span>
        <span>
          <span className="text-scoring-high">{qualification.votesYes}</span>
          {" / "}
          {qualification.votesNeutral}
          {" / "}
          <span className="text-scoring-low">{qualification.votesNo}</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-xs">
        <span>Relevanz-Score:</span>
        <span>{qualification.relevanzScore}</span>
      </div>
      <div className="flex items-center justify-between gap-xs">
        <span>Komplexität-Score:</span>
        <span>{qualification.komplexitaetScore}</span>
      </div>
    </div>
  );
}
