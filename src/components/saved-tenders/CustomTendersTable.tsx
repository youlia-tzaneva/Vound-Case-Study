import { Badge, statusToVariant, urgencyToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Avatar } from "../ui/Avatar";
import { Checkbox } from "../ui/Checkbox";
import { TextLink } from "../ui/TextLink";
import type { Tender, TenderOwner } from "../../types/tender";
import type { VoteType } from "../../utils/applyVote";
import type { TableColumnId } from "../../data/tableColumns";
import { allTableColumns, ensureSelectColumnFirst } from "../../data/tableColumns";
import { statusLabels } from "../../data/mockTenders";
import { ProjectOwnerCell } from "./ProjectOwnerCell";
import { QualificationCell } from "./QualificationCell";
import type { TableSelectionProps } from "./SelectableTableShell";
import type { StatusFilterProps } from "./StatusColumnHeader";
import { StatusColumnHeader } from "./StatusColumnHeader";
import { getTdClass, tableClass, tableWrapperClass, thClass } from "./tableStyles";

interface CustomTendersTableProps extends TableSelectionProps, StatusFilterProps {
  tenders: Tender[];
  columns: TableColumnId[];
  activeTenderId?: string | null;
  onTenderOpen: (tender: Tender) => void;
  onOwnerChange: (tenderId: string, owner: TenderOwner) => void;
  onVote?: (
    tenderId: string,
    type: VoteType,
    qualification: Tender["qualification"],
  ) => void;
}

export function CustomTendersTable({
  tenders,
  columns,
  activeTenderId = null,
  onTenderOpen,
  onOwnerChange,
  onVote,
  selectedStatuses,
  onStatusToggle,
  isRowSelected,
  onRowSelectedChange,
}: CustomTendersTableProps) {
  const orderedColumns = ensureSelectColumnFirst(columns);
  const columnLabels = new Map(allTableColumns.map((column) => [column.id, column.label]));

  return (
    <div className={tableWrapperClass}>
      <table className={`${tableClass} min-w-[900px]`}>
        <thead>
          <tr>
            {orderedColumns.map((columnId, index) => (
              <th
                key={columnId}
                scope="col"
                className={`${thClass} ${index === orderedColumns.length - 1 ? "border-r-0" : ""}`}
              >
                {columnId === "select" ? (
                  <span className="sr-only">{columnLabels.get(columnId)}</span>
                ) : columnId === "status" ? (
                  <StatusColumnHeader
                    selectedStatuses={selectedStatuses}
                    onStatusToggle={onStatusToggle}
                  />
                ) : (
                  columnLabels.get(columnId)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <CustomTenderRow
              key={tender.id}
              tender={tender}
              columns={orderedColumns}
              isActive={activeTenderId === tender.id}
              isSelected={isRowSelected(tender.id)}
              onSelectedChange={(checked) =>
                onRowSelectedChange(tender.id, checked)
              }
              onOpen={() => onTenderOpen(tender)}
              onOwnerChange={(owner) => onOwnerChange(tender.id, owner)}
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

function CustomTenderRow({
  tender,
  columns,
  isActive,
  isSelected,
  onSelectedChange,
  onOpen,
  onOwnerChange,
  onVote,
}: {
  tender: Tender;
  columns: TableColumnId[];
  isActive: boolean;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOpen: () => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onVote?: (type: VoteType) => void;
}) {
  const isHighlighted = isSelected || isActive;
  const cellClass = (extra?: string) => getTdClass(isHighlighted, extra);

  return (
    <tr className="group cursor-pointer" onClick={onOpen}>
      {columns.map((columnId, index) => (
        <td
          key={columnId}
          className={cellClass(index === columns.length - 1 ? "border-r-0" : undefined)}
          onClick={
            columnId === "select" || columnId === "owner"
              ? (event) => event.stopPropagation()
              : undefined
          }
        >
          <ColumnCell
            columnId={columnId}
            tender={tender}
            isSelected={isSelected}
            onSelectedChange={onSelectedChange}
            onOwnerChange={onOwnerChange}
            onVote={onVote}
          />
        </td>
      ))}
    </tr>
  );
}

function ColumnCell({
  columnId,
  tender,
  isSelected,
  onSelectedChange,
  onOwnerChange,
  onVote,
}: {
  columnId: TableColumnId;
  tender: Tender;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onOwnerChange: (owner: TenderOwner) => void;
  onVote?: (type: VoteType) => void;
}) {
  switch (columnId) {
    case "select":
      return (
        <Checkbox
          checked={isSelected}
          onChange={onSelectedChange}
          label={`${tender.name} auswählen`}
        />
      );
    case "name":
      return (
        <div className="flex flex-col gap-4xs break-words">
          <span className="text-tender-title text-text-primary">{tender.name}</span>
          <span className="text-small text-text-secondary">{tender.location}</span>
        </div>
      );
    case "urgent":
      return tender.urgency && tender.urgencyLabel ? (
        <Badge variant={urgencyToVariant(tender.urgency)}>{tender.urgencyLabel}</Badge>
      ) : (
        <UnknownValue />
      );
    case "deadline":
      return (
        <div className="flex flex-col gap-3xs">
          <DeadlineUrgencyText deadline={tender.deadline} urgency={tender.urgency} />
          <DeadlineText deadline={tender.deadline} />
        </div>
      );
    case "status":
      return (
        <Badge variant={statusToVariant(tender.status)}>
          {statusLabels[tender.status]}
        </Badge>
      );
    case "updates":
      return <UpdatesCell update={tender.update} />;
    case "owner":
      return (
        <ProjectOwnerCell owner={tender.owner} onOwnerChange={onOwnerChange} />
      );
    case "qualification":
      return (
        <QualificationCell
          qualification={tender.qualification}
          onVote={(type) => onVote?.(type)}
        />
      );
    case "comments":
      return <CommentsCell comment={tender.comment} />;
    case "service-type":
    case "lp":
    case "team":
    case "volume":
      return <UnknownValue />;
    default:
      return <UnknownValue />;
  }
}

function UnknownValue() {
  return <span className="text-table text-text-primary">Unbekannt</span>;
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
    return <UnknownValue />;
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
    return <UnknownValue />;
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
          <span className="text-body text-text-primary">{comment.author.name}</span>
        </div>
        <p className="pl-[28px] text-small text-text-secondary">{comment.timestamp}</p>
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
