export type TenderStatus =
  | "vorgemerkt"
  | "in-bearbeitung"
  | "abgegeben"
  | "gewonnen";

export type UrgencyType = "overdue" | "deadline-soon" | null;

export interface TenderOwner {
  name: string;
  initials: string;
  color: string;
}

export interface TenderQualification {
  votesYes: number;
  votesNeutral: number;
  votesNo: number;
  relevanzScore: number;
  komplexitaetScore: number;
}

export interface TenderUpdate {
  title: string;
  isNew: boolean;
}

export interface TenderComment {
  author: TenderOwner;
  timestamp: string;
  preview: string;
}

export interface Tender {
  id: string;
  name: string;
  location: string;
  deadline: string;
  urgency: UrgencyType;
  urgencyLabel?: string;
  status: TenderStatus;
  owner: TenderOwner;
  qualification: TenderQualification;
  update: TenderUpdate | null;
  comment: TenderComment | null;
}

export interface SavedView {
  id: string;
  label: string;
  isActive?: boolean;
}

export type UrgentReasonType =
  | "warten-auf-abstimmung"
  | "frist-geaendert"
  | "neues-dokument"
  | "kein-projekt-owner";

export interface UrgentTender {
  id: string;
  name: string;
  location: string;
  urgentReason: UrgentReasonType;
  deadline: string;
  urgency: UrgencyType;
  urgencyLabel?: string;
  status: TenderStatus;
  update: TenderUpdate | null;
  owner: TenderOwner | null;
  qualification: TenderQualification;
}

export interface TeamTender {
  id: string;
  name: string;
  location: string;
  leistungsart: string;
  lp: string;
  status: TenderStatus;
  deadline: string;
  urgency: UrgencyType;
  urgencyLabel?: string;
  update: TenderUpdate | null;
  owner: TenderOwner;
  team: string;
}

export interface LeadershipTender {
  id: string;
  name: string;
  location: string;
  status: TenderStatus;
  deadline: string;
  urgency: UrgencyType;
  urgencyLabel?: string;
  volumen: string;
  qualification: TenderQualification;
  owner: TenderOwner;
  team: string;
}

export interface TenderPanelUpdate {
  title: string;
  timestamp: string;
  description: string;
  isNew?: boolean;
}

export interface TenderPanelTimelineEvent {
  label: string;
  value: string;
}

export interface TenderPanelRequirements {
  mindestkriterien: number;
  wertungTeilnahme: number;
  zuschlagskriterien: number;
  sections: { label: string; count: number }[];
}

export interface TenderPanelView {
  id: string;
  name: string;
  location: string;
  deadline: string;
  urgency: UrgencyType;
  urgencyLabel?: string;
  status: TenderStatus;
  owner: TenderOwner | null;
  qualification: TenderQualification;
  buyer: string;
  volumen: string;
  leistungsart: string;
  lp: string;
  gebaeudetyp: string;
  verfahrensart: string;
  entfernung: string;
  uploadDate: string;
  team: string;
  partner: string;
  updates: TenderPanelUpdate[];
  comments: TenderComment[];
  timelineDescription: string;
  timelineEvents: TenderPanelTimelineEvent[];
  requirements: TenderPanelRequirements;
}

export type TenderListItem =
  | Tender
  | UrgentTender
  | TeamTender
  | LeadershipTender;
