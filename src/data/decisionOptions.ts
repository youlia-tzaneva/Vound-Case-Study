import type { TenderDecision } from "../types/tender";

export const decisionLabels: Record<TenderDecision, string> = {
  "abgabe-geplant": "Abgabe geplant",
  aussortiert: "Aussortiert",
};

export const decisionOptions: {
  value: TenderDecision;
  label: string;
}[] = [
  { value: "abgabe-geplant", label: decisionLabels["abgabe-geplant"] },
  { value: "aussortiert", label: decisionLabels.aussortiert },
];
