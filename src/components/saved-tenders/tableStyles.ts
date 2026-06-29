export const tableWrapperClass = "w-full";

export const tableScrollContainerClass =
  "min-h-0 flex-1 overflow-auto rounded-container border border-border-dark bg-bg-containers [overflow-anchor:none]";

export const tableClass = "w-full border-separate border-spacing-0";

export const thClass =
  "sticky top-0 z-[1] border-b border-r border-border-light bg-bg-light p-xs text-left text-filter-label font-light text-text-primary";

const tdBaseClass =
  "border-b border-r border-border-light p-xs align-top text-table";

export const tdClass = `${tdBaseClass} bg-bg-containers`;

export const tdSelectedClass = `${tdBaseClass} bg-bg-row-selected`;

export function getTdClass(selected: boolean, extra?: string) {
  const base = selected ? tdSelectedClass : tdClass;
  return extra ? `${base} ${extra}` : base;
}
