import type { SavedView, TenderOwner, UrgentReasonType } from "../types/tender";
import { USER_AVATAR_URLS } from "./userAvatars";

export const currentUser: TenderOwner = {
  name: "Kat Schwarz",
  initials: "K",
  color: "#e77b54",
  avatarUrl: USER_AVATAR_URLS["Kat Schwarz"],
};

export const panelUsers: TenderOwner[] = [
  currentUser,
  {
    name: "John Smith",
    initials: "J",
    color: "#a472e4",
    avatarUrl: USER_AVATAR_URLS["John Smith"],
  },
  {
    name: "Marie Volker",
    initials: "M",
    color: "#24922f",
    avatarUrl: USER_AVATAR_URLS["Marie Volker"],
  },
  {
    name: "Max Waltz",
    initials: "M",
    color: "#e91418",
    avatarUrl: USER_AVATAR_URLS["Max Waltz"],
  },
  {
    name: "Johan Stein",
    initials: "J",
    color: "#4f84ee",
    avatarUrl: USER_AVATAR_URLS["Johan Stein"],
  },
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

export { allTenderStatuses, createDefaultStatusFilter, statusLabels } from "./statusFilter";

export const urgentReasonLabels: Record<UrgentReasonType, string> = {
  "warten-auf-abstimmung": "Warten auf die abstimmung",
  "frist-geaendert": "Frist geändert",
  "neues-dokument": "Neues dokument",
  "kein-projekt-owner": "Kein projekt owner",
};
