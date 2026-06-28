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
