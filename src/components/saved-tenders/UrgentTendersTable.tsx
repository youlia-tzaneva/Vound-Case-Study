import {
  Badge,
  getVariantTextClass,
  statusToVariant,
  urgentReasonToVariant,
} from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { UrgentTender, TenderOwner } from "../../types/tender";
import { statusLabels, urgentReasonLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { QualificationCell } from "./QualificationCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import { getTdClass, thClass } from "./tableStyles";

interface UrgentTendersTableProps extends TableSelectionProps {
  tenders: UrgentTender[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: UrgentTender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onQualificationChange?: (
    tenderId: string,
    qualification: UrgentTender["qualification"],
  ) => void;
}

export function UrgentTendersTable({
  tenders,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onQualificationChange,
  isRowSelected,
  onRowSelectedChange,
}: UrgentTendersTableProps) {
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
              Dringend
            </th>
            <th scope="col" className={`${thClass} w-[136px]`}>
              Abgabefrist
            </th>
            <th scope="col" className={`${thClass} w-[176px]`}>
              Status
            </th>
            <th scope="col" className={`${thClass} w-[182px]`}>
              Aktualisierungen
            </th>
            <th scope="col" className={`${thClass} w-[168px]`}>
              Projekt Owner
            </th>
            <th scope="col" className={`${thClass} w-[173px] border-r-0`}>
              Qualifikation
            </th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <UrgentTenderRow
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

function UrgentTenderRow({
  tender,
  isActive,
  isSelected,
  onSelectedChange,
  onOpen,
  onOwnerChange,
  onQualificationChange,
}: {
  tender: UrgentTender;
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onQualificationChange?: (
    qualification: UrgentTender["qualification"],
  ) => void;
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
        <UrgentReasonCell reason={tender.urgentReason} />
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
        <UpdatesCell update={tender.update} />
      </td>
      <td className={cellClass()}>
        <ProjectOwnerCell
          owner={tender.owner}
          onOwnerChange={onOwnerChange}
        />
      </td>
      <td className={cellClass("border-r-0")}>
        <QualificationCell
          tenderId={tender.id}
          qualification={tender.qualification}
          onQualificationChange={onQualificationChange}
        />
      </td>
    </tr>
  );
}

function UrgentReasonCell({ reason }: { reason: UrgentTender["urgentReason"] }) {
  return (
    <div className="flex flex-col gap-3xs">
      <span
        className={`text-table ${getVariantTextClass(urgentReasonToVariant(reason))}`}
      >
        {urgentReasonLabels[reason]}
      </span>
      {reason === "neues-dokument" && <TextLink>Dokument anzeigen</TextLink>}
    </div>
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

function UpdatesCell({ update }: { update: UrgentTender["update"] }) {
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
