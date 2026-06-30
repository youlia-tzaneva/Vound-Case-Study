export const tableWrapperClass = "w-full";

export const tableContainerClass =
  "overflow-x-auto rounded-container border border-border-dark bg-bg-containers";

export const tableClass = "w-full border-separate border-spacing-0";

export const thClass =
  "sticky top-0 z-[1] border-b border-r border-border-light bg-bg-light px-2xs py-xs text-left text-filter-label font-light text-text-primary";

const tdBaseClass =
  "border-b border-r border-border-light px-2xs py-xs align-top text-table";

export const tdClass = `${tdBaseClass} bg-bg-containers`;

export const tdSelectedClass = `${tdBaseClass} bg-bg-row-selected`;

export function getTdClass(selected: boolean, extra?: string) {
  const base = selected ? tdSelectedClass : tdClass;
  return extra ? `${base} ${extra}` : base;
}

export const deadlineColumnClass = "w-0 whitespace-nowrap";

export const selectColumnClass = "w-0 whitespace-nowrap overflow-hidden";

export const teamNameColumnClass =
  "w-[189px] max-w-[189px] overflow-hidden break-words";

export const statusColumnClass =
  "w-[176px] max-w-[176px] overflow-hidden break-words";

export const teamStatusColumnClass =
  "w-[160px] max-w-[160px] overflow-hidden break-words";

export const teamUpdatesColumnClass =
  "w-[136px] max-w-[136px] overflow-hidden break-words";

export const teamProjectOwnerColumnClass =
  "w-[158.93px] max-w-[158.93px] overflow-hidden break-words";

export const teamTeamColumnClass =
  "w-[122px] max-w-[122px] overflow-hidden break-words";

export const teamDecisionColumnClass =
  "w-[125.77px] max-w-[125.77px]";

export const teamDecisionCellClass =
  `${teamDecisionColumnClass} overflow-visible has-[button[aria-expanded=true]]:relative has-[button[aria-expanded=true]]:z-20`;
