import { useCallback, useEffect, useMemo, useState } from "react";

export function useTenderRowSelection(tenderIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const tenderIdKey = useMemo(() => tenderIds.join("\0"), [tenderIds]);

  useEffect(() => {
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => tenderIds.includes(id)));
      return next.size === current.size ? current : next;
    });
  }, [tenderIdKey, tenderIds]);

  const selectedCount = selectedIds.size;
  const totalCount = tenderIds.length;
  const hasSelection = selectedCount > 0;
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = selectedCount > 0 && !allSelected;

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggleRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(tenderIds));
  }, [tenderIds]);

  const selectNone = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.size === tenderIds.length ? new Set() : new Set(tenderIds),
    );
  }, [tenderIds]);

  return {
    selectedIds,
    selectedCount,
    hasSelection,
    allSelected,
    someSelected,
    isSelected,
    toggleRow,
    selectAll,
    selectNone,
    toggleAll,
  };
}
