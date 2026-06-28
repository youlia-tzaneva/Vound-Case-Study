import type { SavedView, Tender, TenderOwner, UrgentReasonType } from "../types/tender";

export const currentUser: TenderOwner = {
  name: "Kat Schwarz",
  initials: "K",
  color: "#e77b54",
};

export const panelUsers: TenderOwner[] = [
  currentUser,
  { name: "John Smith", initials: "J", color: "#a472e4" },
  { name: "Marie Volker", initials: "M", color: "#24922f" },
  { name: "Max Waltz", initials: "M", color: "#e91418" },
  { name: "Johan Stein", initials: "J", color: "#4f84ee" },
];

export const panelTeams = [
  "Hochbau",
  "Tiefbau",
  "Verkehr",
  "Generalplanung",
] as const;

export const panelPartners = [
  "Partner name",
  "Planungsbüro Nord",
  "Ingenieurgesellschaft Süd",
  "Architekturbüro West",
] as const;

export const savedViews: SavedView[] = [
  { id: "all", label: "Alle Projekte", isActive: true },
  { id: "my", label: "Meine Projekte" },
  { id: "attention", label: "Dringend" },
  { id: "team", label: "Team" },
  { id: "leadership", label: "Führung" },
];

export const statusLabels: Record<Tender["status"], string> = {
  vorgemerkt: "Vorgemerkt",
  "in-bearbeitung": "Teilnahmeantrag in bearbeitung",
  abgegeben: "Teilnahmeantrag Abgegeben",
  gewonnen: "Gewonnen",
};

export const urgentReasonLabels: Record<UrgentReasonType, string> = {
  "warten-auf-abstimmung": "Warten auf die abstimmung",
  "frist-geaendert": "Frist geändert",
  "neues-dokument": "Neues dokument",
  "kein-projekt-owner": "Kein projekt owner",
};
