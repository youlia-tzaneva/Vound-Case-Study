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
  const daysLeft = getDaysUntilDeadline(deadline);

  if (daysLeft < 0) {
    return (
      <span className="text-table text-urgency-overdue-text">Überfällig</span>
    );
  }

  if (urgency === "deadline-soon") {
    return (
      <span className="text-table text-urgency-deadline-text">
        Noch {daysLeft} Tage
      </span>
    );
  }

  return null;
}
