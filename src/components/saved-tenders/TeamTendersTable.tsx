import { Badge, statusToVariant, urgencyToVariant } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { TeamTender } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";

const thClass =
  "border-b border-r border-border-light bg-bg-light p-xs text-left text-filter-label font-light text-text-primary";

const tdClass =
  "border-b border-r border-border-light bg-bg-containers p-xs align-top text-table";

interface TeamTendersTableProps {
  tenders: TeamTender[];
}

export function TeamTendersTable({ tenders }: TeamTendersTableProps) {
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
            <TeamTenderRow key={tender.id} tender={tender} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamTenderRow({ tender }: { tender: TeamTender }) {
  return (
    <tr className="group">
      <td className={tdClass}>
        <Checkbox label={`${tender.name} auswählen`} />
      </td>
      <td className={tdClass}>
        <div className="flex flex-col gap-4xs break-words">
          <span className="text-tender-title text-text-primary">
            {tender.name}
          </span>
          <span className="text-small text-text-secondary">
            {tender.location}
          </span>
        </div>
      </td>
      <td className={tdClass}>
        <span className="break-words text-table text-text-primary">
          {tender.leistungsart}
        </span>
      </td>
      <td className={tdClass}>
        <span className="break-words text-table text-text-primary">
          {tender.lp}
        </span>
      </td>
      <td className={tdClass}>
        <Badge variant={statusToVariant(tender.status)}>
          {statusLabels[tender.status]}
        </Badge>
      </td>
      <td className={tdClass}>
        <div className="flex flex-col gap-3xs">
          {tender.urgency && tender.urgencyLabel && (
            <Badge variant={urgencyToVariant(tender.urgency)}>
              {tender.urgencyLabel}
            </Badge>
          )}
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={tdClass}>
        <UpdatesCell update={tender.update} />
      </td>
      <td className={tdClass}>
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
      <td className={`${tdClass} border-r-0`}>
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
