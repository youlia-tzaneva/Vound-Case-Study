import type { TenderOwner } from "../../types/tender";

export interface BulkSelectionProps {
  onBulkOwnerChange: (tenderIds: string[], owner: TenderOwner) => void;
  onBulkTeamChange: (tenderIds: string[], team: string) => void;
  onBulkMarkUpdatesReadChange: (
    markAsRead: boolean,
    tenderIds: string[],
  ) => void;
}

export interface TableSelectionProps {
  isRowSelected: (id: string) => boolean;
  onRowSelectedChange: (id: string, checked: boolean) => void;
}

export type TenderTableProps = BulkSelectionProps & TableSelectionProps;
