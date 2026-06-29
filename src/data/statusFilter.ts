import type { TenderStatus } from "../types/tender";

export const allTenderStatuses: TenderStatus[] = [
  "vorgemerkt",
  "aussortiert",
  "teilnahmeantrag-in-bearbeitung",
  "teilnahmeantrag-abgegeben",
  "angebot-in-bearbeitung",
  "angebot-abgegeben",
  "gewonnen",
  "teilnahmeantrag-abgelehnt",
  "angebot-abgelehnt",
];

export const statusLabels: Record<TenderStatus, string> = {
  vorgemerkt: "Vorgemerkt",
  aussortiert: "Aussortiert",
  "teilnahmeantrag-in-bearbeitung": "Teilnahmeantrag in Bearbeitung",
  "teilnahmeantrag-abgegeben": "Teilnahmeantrag abgegeben",
  "angebot-in-bearbeitung": "Angebot in Bearbeitung",
  "angebot-abgegeben": "Angebot abgegeben",
  gewonnen: "Gewonnen",
  "teilnahmeantrag-abgelehnt": "Teilnahmeantrag abgelehnt",
  "angebot-abgelehnt": "Angebot abgelehnt",
};

export function createDefaultStatusFilter(): Set<TenderStatus> {
  return new Set(
    allTenderStatuses.filter((status) => status !== "aussortiert"),
  );
}

export function matchesStatusFilter(
  status: TenderStatus,
  selectedStatuses: Set<TenderStatus>,
) {
  return selectedStatuses.has(status);
}
