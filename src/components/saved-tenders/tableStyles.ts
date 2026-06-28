export const thClass =
  "border-b border-r border-border-light bg-bg-light p-xs text-left text-filter-label font-light text-text-primary";

const tdBaseClass =
  "border-b border-r border-border-light p-xs align-top text-table";

export const tdClass = `${tdBaseClass} bg-bg-containers`;

export const tdSelectedClass = `${tdBaseClass} bg-bg-row-selected`;

export function getTdClass(selected: boolean, extra?: string) {
  const base = selected ? tdSelectedClass : tdClass;
  return extra ? `${base} ${extra}` : base;
}
