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

export const defaultTableColumnOrder = allTableColumns.map((column) => column.id);

export function ensureSelectColumnFirst(columns: TableColumnId[]): TableColumnId[] {
  const rest = columns.filter(
    (column) => column !== "select" && column !== "name" && column !== "decision",
  );

  return ["select", "name", ...rest, "decision"];
}
