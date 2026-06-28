import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  allTableColumns,
  defaultTableColumnOrder,
  ensureSelectColumnFirst,
  type TableColumnId,
} from "../../data/tableColumns";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Modal } from "../ui/Modal";
import { withIconClass } from "../ui/iconProps";

interface ColumnSelection {
  id: TableColumnId;
  label: string;
  selected: boolean;
}

interface CreateCustomWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workspace: { label: string; columns: TableColumnId[] }) => void;
}

function createInitialColumns(): ColumnSelection[] {
  return pinRequiredColumnsFirst(
    defaultTableColumnOrder.map((id) => {
      const column = allTableColumns.find((entry) => entry.id === id);

      return {
        id,
        label: column?.label ?? id,
        selected: id === "select" || id === "name",
      };
    }),
  );
}

function pinRequiredColumnsFirst(columns: ColumnSelection[]): ColumnSelection[] {
  const nameColumn = columns.find((column) => column.id === "name");
  const selectColumn = columns.find((column) => column.id === "select");
  const rest = columns.filter(
    (column) => column.id !== "name" && column.id !== "select",
  );

  return [
    ...(nameColumn ? [nameColumn] : []),
    ...(selectColumn ? [selectColumn] : []),
    ...rest,
  ];
}

const immovableColumnIds = new Set<TableColumnId>(["select", "name"]);

export function CreateCustomWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCustomWorkspaceModalProps) {
  const [title, setTitle] = useState("");
  const [columns, setColumns] = useState<ColumnSelection[]>(createInitialColumns);

  const selectedCount = columns.filter((column) => column.selected).length;
  const canCreate = title.trim().length > 0 && selectedCount >= 6;
  const firstMovableSelectedIndex = columns.findIndex(
    (column) => column.selected && !immovableColumnIds.has(column.id),
  );
  const lastMovableSelectedIndex = columns.findLastIndex(
    (column) => column.selected && !immovableColumnIds.has(column.id),
  );

  const resetForm = () => {
    setTitle("");
    setColumns(createInitialColumns());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    onCreate({
      label: title.trim(),
      columns: ensureSelectColumnFirst(
        columns.filter((column) => column.selected).map((column) => column.id),
      ),
    });
    resetForm();
    onClose();
  };

  const toggleColumn = (id: TableColumnId, selected: boolean) => {
    if (immovableColumnIds.has(id) && !selected) {
      return;
    }

    setColumns((current) => {
      const updated = current.map((column) =>
        column.id === id ? { ...column, selected } : column,
      );
      const column = updated.find((entry) => entry.id === id);

      if (!column) {
        return current;
      }

      const rest = updated.filter((entry) => entry.id !== id);
      const checked = rest.filter((entry) => entry.selected);
      const unchecked = rest.filter((entry) => !entry.selected);

      return pinRequiredColumnsFirst([...checked, column, ...unchecked]);
    });
  };

  const moveColumn = (index: number, direction: -1 | 1) => {
    setColumns((current) => {
      const column = current[index];

      if (!column?.selected || immovableColumnIds.has(column.id)) {
        return current;
      }

      const nextIndex = index + direction;
      const adjacent = current[nextIndex];

      if (!adjacent?.selected || immovableColumnIds.has(adjacent.id)) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return pinRequiredColumnsFirst(next);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Erstellen Sie einen benutzerdefinierten Arbeitsbereich"
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Stornieren
          </Button>
          <Button disabled={!canCreate} onClick={handleCreate}>
            Erstellen
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-xs">
        <label className="flex flex-col gap-4xs">
          <span className="text-filter-label text-text-primary">
            Arbeitsbereich-Titel
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titel eingeben..."
            className="rounded-container border border-border-light px-xs py-3xs text-body text-text-primary outline-none placeholder:text-text-secondary"
          />
        </label>

        <div className="flex flex-col gap-3xs">
          <div className="flex items-center justify-between gap-xs">
            <span className="text-filter-label text-text-primary">Spalten</span>
            <span className="text-caption text-text-secondary">
              {selectedCount} ausgewählt (mindestens 6)
            </span>
          </div>

          <ul className="flex flex-col rounded-container border border-border-light">
            {columns.map((column, index) => (
              <li
                key={column.id}
                className="flex items-center justify-between gap-xs border-b border-border-light px-xs py-3xs last:border-b-0"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4xs">
                  <Checkbox
                    checked={column.selected}
                    onChange={(checked) => toggleColumn(column.id, checked)}
                    label={`${column.label} auswählen`}
                    disabled={immovableColumnIds.has(column.id)}
                  />
                  <span className="text-table text-text-primary">
                    {column.label}
                    {column.id === "name" && (
                      <span aria-hidden="true">*</span>
                    )}
                  </span>
                </div>

                {column.selected && !immovableColumnIds.has(column.id) && (
                  <div className="flex shrink-0 items-center gap-4xs">
                    <button
                      type="button"
                      aria-label={`${column.label} nach oben verschieben`}
                      disabled={index === firstMovableSelectedIndex}
                      onClick={() => moveColumn(index, -1)}
                      className="group inline-flex items-center justify-center"
                    >
                      <ChevronUp
                        {...withIconClass("group-disabled:text-icon-disabled")}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`${column.label} nach unten verschieben`}
                      disabled={index === lastMovableSelectedIndex}
                      onClick={() => moveColumn(index, 1)}
                      className="group inline-flex items-center justify-center"
                    >
                      <ChevronDown
                        {...withIconClass("group-disabled:text-icon-disabled")}
                      />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
