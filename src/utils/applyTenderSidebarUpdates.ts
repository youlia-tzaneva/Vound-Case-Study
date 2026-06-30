import type {
  LeadershipTender,
  TeamTender,
  Tender,
  TenderSidebarUpdates,
  UrgentTender,
} from "../types/tender";

function applySidebarUpdates<
  T extends Tender | UrgentTender | TeamTender | LeadershipTender,
>(tender: T, updates: TenderSidebarUpdates): T {
  const next = { ...tender };

  if (updates.owner !== undefined && "owner" in next) {
    next.owner = updates.owner as T["owner"];
  }

  if (updates.team !== undefined) {
    if ("team" in next) {
      next.team = updates.team;
    } else if ("comment" in next) {
      (next as Tender).team = updates.team;
    }
  }

  if (updates.qualification !== undefined && "qualification" in next) {
    next.qualification = updates.qualification;
  }

  if (updates.status !== undefined) {
    next.status = updates.status;
  }

  if (updates.decision !== undefined && "decision" in next) {
    next.decision = updates.decision;
  }

  return next;
}

export function mapTenderList<
  T extends Tender | UrgentTender | TeamTender | LeadershipTender,
>(list: T[], tenderId: string, updates: TenderSidebarUpdates): T[] {
  return list.map((tender) =>
    tender.id === tenderId ? applySidebarUpdates(tender, updates) : tender,
  );
}
