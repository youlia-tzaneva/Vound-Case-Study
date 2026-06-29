import type { UrgencyType } from "../../types/tender";
import { getDaysUntilDeadline } from "../../utils/deadline";

interface DeadlineUrgencyTextProps {
  deadline: string;
  urgency: UrgencyType;
}

export function DeadlineUrgencyText({
  deadline,
  urgency,
}: DeadlineUrgencyTextProps) {
  if (!urgency) {
    return null;
  }

  if (urgency === "overdue") {
    return (
      <span className="text-table text-urgency-overdue-text">Überfällig</span>
    );
  }

  const daysLeft = getDaysUntilDeadline(deadline);

  return (
    <span className="text-table text-urgency-deadline-text">
      Noch {daysLeft} Tage
    </span>
  );
}
