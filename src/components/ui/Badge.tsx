import type { ReactNode } from "react";

type BadgeVariant =
  | "status-info"
  | "status-progress"
  | "status-submitted"
  | "status-success"
  | "status-rejected"
  | "urgency-overdue"
  | "urgency-deadline";

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; fullWidth?: boolean; fitContent?: boolean }
> = {
  "status-info": {
    bg: "bg-status-info-bg",
    text: "text-status-info-text",
  },
  "status-progress": {
    bg: "bg-status-progress-bg",
    text: "text-status-progress-text",
    fitContent: true,
  },
  "status-submitted": {
    bg: "bg-status-submitted-bg",
    text: "text-status-submitted-text",
    fitContent: true,
  },
  "status-success": {
    bg: "bg-status-success-bg",
    text: "text-status-success-text",
  },
  "status-rejected": {
    bg: "bg-status-rejected-bg",
    text: "text-status-rejected-text",
    fitContent: true,
  },
  "urgency-overdue": {
    bg: "bg-urgency-overdue-bg",
    text: "text-urgency-overdue-text",
    fullWidth: true,
  },
  "urgency-deadline": {
    bg: "bg-urgency-deadline-bg",
    text: "text-urgency-deadline-text",
    fullWidth: true,
  },
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[2px] px-3xs py-4xs text-badge ${styles.bg} ${styles.text} ${styles.fullWidth ? "w-full" : ""} ${styles.fitContent ? "w-fit" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

export function getVariantTextClass(variant: BadgeVariant): string {
  return variantStyles[variant].text;
}

export function statusToVariant(
  status:
    | "vorgemerkt"
    | "aussortiert"
    | "teilnahmeantrag-in-bearbeitung"
    | "teilnahmeantrag-abgegeben"
    | "angebot-in-bearbeitung"
    | "angebot-abgegeben"
    | "gewonnen"
    | "teilnahmeantrag-abgelehnt"
    | "angebot-abgelehnt",
): BadgeVariant {
  const map = {
    vorgemerkt: "status-info",
    aussortiert: "status-rejected",
    "teilnahmeantrag-in-bearbeitung": "status-progress",
    "teilnahmeantrag-abgegeben": "status-submitted",
    "angebot-in-bearbeitung": "status-progress",
    "angebot-abgegeben": "status-submitted",
    gewonnen: "status-success",
    "teilnahmeantrag-abgelehnt": "status-rejected",
    "angebot-abgelehnt": "status-rejected",
  } as const;

  return map[status];
}

export function urgencyToVariant(
  urgency: "overdue" | "deadline-soon",
): BadgeVariant {
  return urgency === "overdue" ? "urgency-overdue" : "urgency-deadline";
}

export function urgentReasonToVariant(
  reason:
    | "warten-auf-abstimmung"
    | "frist-geaendert"
    | "neues-dokument"
    | "kein-projekt-owner",
): BadgeVariant {
  const map = {
    "warten-auf-abstimmung": "status-progress",
    "frist-geaendert": "urgency-overdue",
    "neues-dokument": "status-info",
    "kein-projekt-owner": "urgency-overdue",
  } as const;

  return map[reason];
}
