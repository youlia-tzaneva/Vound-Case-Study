export type TableColumnId =
  | "select"
  | "name"
  | "urgent"
  | "deadline"
  | "status"
  | "updates"
  | "owner"
  | "qualification"
  | "comments"
  | "service-type"
  | "lp"
  | "team"
  | "volume"
  | "decision";

export interface TableColumnDefinition {
  id: TableColumnId;
  label: string;
}

export const allTableColumns: TableColumnDefinition[] = [
  { id: "select", label: "Auswählen" },
  { id: "name", label: "Name" },
  { id: "urgent", label: "Dringend" },
  { id: "deadline", label: "Abgabefrist" },
  { id: "status", label: "Status" },
  { id: "updates", label: "Aktualisierungen" },
  { id: "owner", label: "Projekt Owner" },
  { id: "qualification", label: "Qualifikation" },
  { id: "comments", label: "Notizen / Kommentare" },
  { id: "service-type", label: "Leistungsart" },
  { id: "lp", label: "LP" },
  { id: "team", label: "Team" },
  { id: "volume", label: "Volumen" },
  { id: "decision", label: "Entscheidung" },
];

export const configurableTableColumns = allTableColumns.filter(
  (column) => column.id !== "select",
);

export const configurableTableColumnOrder = configurableTableColumns.map(
  (column) => column.id,
);

export const defaultTableColumnOrder = allTableColumns.map((column) => column.id);

export function normalizeCustomWorkspaceColumns(
  columns: TableColumnId[],
): TableColumnId[] {
  const withoutSelect = columns.filter((column) => column !== "select");
  const nameIndex = withoutSelect.indexOf("name");

  if (nameIndex === -1) {
    return withoutSelect;
  }

  const rest = withoutSelect.filter((column) => column !== "name");
  return ["name", ...rest];
}

export const immovableCustomWorkspaceColumnIds = new Set<TableColumnId>([
  "name",
]);

export function toggleCustomWorkspaceColumn(
  columns: TableColumnId[],
  columnId: TableColumnId,
  selected: boolean,
): TableColumnId[] {
  if (!selected && immovableCustomWorkspaceColumnIds.has(columnId)) {
    return normalizeCustomWorkspaceColumns(columns);
  }

  const normalized = normalizeCustomWorkspaceColumns(columns);

  if (selected) {
    if (normalized.includes(columnId)) {
      return normalized;
    }

    return normalizeCustomWorkspaceColumns([...normalized, columnId]);
  }

  return normalizeCustomWorkspaceColumns(
    normalized.filter((column) => column !== columnId),
  );
}

/** @deprecated Use normalizeCustomWorkspaceColumns for custom workspaces. */
export function ensureSelectColumnFirst(columns: TableColumnId[]): TableColumnId[] {
  return normalizeCustomWorkspaceColumns(columns);
}
