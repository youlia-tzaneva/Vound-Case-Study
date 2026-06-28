import { X } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { withIconClass } from "../ui/iconProps";
import type { TenderOwner } from "../../types/tender";

interface ActiveFilterTagsProps {
  ownerFilter: TenderOwner | null;
  onRemoveOwnerFilter: () => void;
}

export function ActiveFilterTags({
  ownerFilter,
  onRemoveOwnerFilter,
}: ActiveFilterTagsProps) {
  if (!ownerFilter) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3xs">
      <span className="inline-flex items-center gap-4xs rounded-pill border border-border-light bg-bg-light py-4xs pl-2xs pr-3xs text-table text-text-primary">
        <span className="text-text-secondary">Projekt Owner</span>
        <Avatar initials={ownerFilter.initials} color={ownerFilter.color} size={16} />
        <span>{ownerFilter.name}</span>
        <button
          type="button"
          aria-label="Projekt Owner Filter entfernen"
          onClick={onRemoveOwnerFilter}
          className="inline-flex items-center justify-center text-icon-default hover:text-icon-hover"
        >
          <X {...withIconClass()} />
        </button>
      </span>
    </div>
  );
}
