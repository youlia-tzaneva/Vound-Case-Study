import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { Tender, TenderOwner } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { QualificationCell } from "./QualificationCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import type { StatusFilterProps } from "./StatusColumnHeader";
import { StatusColumnHeader } from "./StatusColumnHeader";
import { getTdClass, tableClass, tableWrapperClass, thClass } from "./tableStyles";

interface TendersTableProps extends TableSelectionProps, StatusFilterProps {
  tenders: Tender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: Tender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onQualificationChange?: (
    tenderId: string,
    qualification: Tender["qualification"],
  ) => void;
}

export function TendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onQualificationChange,
  selectedStatuses,
  onStatusToggle,
  isRowSelected,
  onRowSelectedChange,
}: TendersTableProps) {
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
            <th scope="col" className={`${thClass} w-[136px]`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              <StatusColumnHeader
                selectedStatuses={selectedStatuses}
                onStatusToggle={onStatusToggle}
              />
            </th>
            <th scope="col" className={`${thClass} w-[168px]`}>
              Projekt Owner
            </th>
            <th scope="col" className={`${thClass} w-[173px]`}>
              Qualifikation
            </th>
            <th scope="col" className={`${thClass} w-[182px]`}>
              Aktualisierungen
            </th>
            <th scope="col" className={`${thClass} border-r-0`}>
              Notizen / Kommentare
            </th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <TenderRow
              key={tender.id}
              tender={tender}
              isActive={activeTenderId === tender.id}
              isSelected={isRowSelected(tender.id)}
              onSelectedChange={(checked) =>
                onRowSelectedChange(tender.id, checked)
              }
              onOpen={() => onTenderOpen(tender)}
              onOwnerChange={(owner) => onOwnerChange(tender.id, owner)}
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

function TenderRow({
  tender,
  isActive,
  isSelected,
  onSelectedChange,
  onOpen,
  onOwnerChange,
  onQualificationChange,
}: {
  tender: Tender;
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onQualificationChange?: (qualification: Tender["qualification"]) => void;
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
        <div className="flex flex-col gap-3xs">
          <DeadlineUrgencyText deadline={tender.deadline} urgency={tender.urgency} />
          <DeadlineText deadline={tender.deadline} />
        </div>
      </td>
      <td className={cellClass()}>
        <Badge variant={statusToVariant(tender.status)}>
          {statusLabels[tender.status]}
        </Badge>
      </td>
      <td className={cellClass()}>
        <ProjectOwnerCell
          owner={tender.owner}
          onOwnerChange={onOwnerChange}
        />
      </td>
      <td className={cellClass()}>
        <QualificationCell
          tenderId={tender.id}
          qualification={tender.qualification}
          onQualificationChange={onQualificationChange}
        />
      </td>
      <td className={cellClass()}>
        <UpdatesCell update={tender.update} />
      </td>
      <td className={cellClass("border-r-0")}>
        <CommentsCell comment={tender.comment} />
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

function UpdatesCell({ update }: { update: Tender["update"] }) {
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

function CommentsCell({ comment }: { comment: Tender["comment"] }) {
  if (!comment) {
    return <span className="text-table text-text-primary">Unbekannt</span>;
  }

  return (
    <div className="flex flex-col gap-3xs">
      <div className="flex flex-col gap-4xs">
        <div className="flex items-center gap-3xs">
          <Avatar
            name={comment.author.name}
            initials={comment.author.initials}
            color={comment.author.color}
            avatarUrl={comment.author.avatarUrl}
          />
          <span className="text-body text-text-primary">
            {comment.author.name}
          </span>
        </div>
        <p className="pl-[28px] text-small text-text-secondary">
          {comment.timestamp}
        </p>
        <p className="break-words pl-[28px] text-table text-text-primary">
          {comment.preview}
        </p>
      </div>
      <div className="pl-[28px]">
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
