import type {
  LeadershipTender,
  TeamTender,
  Tender,
  TenderUpdate,
  UrgentTender,
} from "../types/tender";

export type MarkTenderUpdatesReadResult<
  T extends Tender | UrgentTender | TeamTender | LeadershipTender,
> = {
  list: T[];
  affectedIds: string[];
};

export function markTenderUpdatesRead<
  T extends Tender | UrgentTender | TeamTender | LeadershipTender,
>(list: T[], tenderIds: string[]): MarkTenderUpdatesReadResult<T> {
  const idSet = new Set(tenderIds);
  const affectedIds: string[] = [];

  const nextList = list.map((tender) => {
    if (!idSet.has(tender.id) || !("update" in tender) || !tender.update) {
      return tender;
    }

    const update = tender.update as TenderUpdate;

    if (!update.isNew) {
      return tender;
    }

    affectedIds.push(tender.id);

    return {
      ...tender,
      update: { ...update, isNew: false },
    };
  });

  return { list: nextList, affectedIds };
}

export function markTenderUpdatesUnread<
  T extends Tender | UrgentTender | TeamTender | LeadershipTender,
>(list: T[], tenderIds: string[]): T[] {
  const idSet = new Set(tenderIds);

  return list.map((tender) => {
    if (!idSet.has(tender.id) || !("update" in tender) || !tender.update) {
      return tender;
    }

    const update = tender.update as TenderUpdate;

    return {
      ...tender,
      update: { ...update, isNew: true },
    };
  });
}
