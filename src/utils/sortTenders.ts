import {
  deriveUploadDate,
  getDaysUntilDeadline,
  parseGermanDate,
} from "./deadline";

export type TenderSortOption = "neueste-projekt" | "abgabefrist";

export function sortTenderList<T extends { deadline: string }>(
  tenders: T[],
  sortBy: TenderSortOption | null,
): T[] {
  if (!sortBy) {
    return tenders;
  }

  const sorted = [...tenders];

  if (sortBy === "neueste-projekt") {
    sorted.sort((a, b) => {
      const uploadDateA = parseGermanDate(deriveUploadDate(a.deadline));
      const uploadDateB = parseGermanDate(deriveUploadDate(b.deadline));

      return uploadDateB.getTime() - uploadDateA.getTime();
    });

    return sorted;
  }

  sorted.sort((a, b) => {
    const daysUntilA = getDaysUntilDeadline(a.deadline);
    const daysUntilB = getDaysUntilDeadline(b.deadline);
    const isOverdueA = daysUntilA < 0;
    const isOverdueB = daysUntilB < 0;

    if (isOverdueA !== isOverdueB) {
      return isOverdueA ? -1 : 1;
    }

    return daysUntilA - daysUntilB;
  });

  return sorted;
}
