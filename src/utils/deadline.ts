export function parseGermanDeadline(deadline: string): Date {
  const [datePart, timePart = "00:00"] = deadline.split(" | ");
  const [day, month, year] = datePart.split(".").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

export function getDaysUntilDeadline(
  deadline: string,
  referenceDate = new Date(),
): number {
  const deadlineDate = parseGermanDeadline(deadline);
  const referenceDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const deadlineDay = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  );

  return Math.round(
    (deadlineDay.getTime() - referenceDay.getTime()) / (24 * 60 * 60 * 1000),
  );
}
