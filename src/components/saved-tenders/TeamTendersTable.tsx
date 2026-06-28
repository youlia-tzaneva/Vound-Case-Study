import { useState } from "react";
import { Badge, statusToVariant, urgencyToVariant } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { TeamTender } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { getTdClass, thClass } from "./tableStyles";

interface TeamTendersTableProps {
  tenders: TeamTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: TeamTender) => void;
}

export function TeamTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
}: TeamTendersTableProps) {
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
            <th scope="col" className={`${thClass} w-[200px]`}>
              Leistungsart
            </th>
            <th scope="col" className={`${thClass} w-[160px]`}>
              LP
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              Status
            </th>
            <th scope="col" className={`${thClass} w-[136px]`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} w-[182px]`}>
              Aktualisierungen
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
            <TeamTenderRow
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

function TeamTenderRow({
  tender,
  isActive,
  onOpen,
}: {
  tender: TeamTender;
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
        <span className="break-words text-table text-text-primary">
          {tender.leistungsart}
        </span>
      </td>
      <td className={cellClass()}>
        <span className="break-words text-table text-text-primary">
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
          {tender.urgency && tender.urgencyLabel && (
            <Badge variant={urgencyToVariant(tender.urgency)}>
              {tender.urgencyLabel}
            </Badge>
          )}
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={cellClass()}>
        <UpdatesCell update={tender.update} />
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

function UpdatesCell({ update }: { update: TeamTender["update"] }) {
  if (!update) {
    return <span className="text-table text-text-primary">Unbekannt</span>;
  }

  return (
    <div className="flex flex-col gap-3xs">
      <div className="flex items-start gap-3xs">
        <UpdateDot isNew={update.isNew} />
        <span
          className={`break-words text-table ${update.isNew ? "text-text-primary" : "text-text-secondary"}`}
        >
          {update.title}
        </span>
      </div>
      <div className="pl-xs">
        <TextLink>Alle anzeigen</TextLink>
      </div>
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
