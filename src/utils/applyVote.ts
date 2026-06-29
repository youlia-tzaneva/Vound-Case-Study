import type { TenderQualification } from "../types/tender";

export type VoteType = "yes" | "neutral" | "no";

export function applyVote(
  qualification: TenderQualification,
  selectedVote: VoteType | null,
  type: VoteType,
): { qualification: TenderQualification; selectedVote: VoteType | null } {
  const nextQualification = { ...qualification };
  let nextSelectedVote: VoteType | null = selectedVote;

  if (selectedVote === type) {
    if (type === "yes") {
      nextQualification.votesYes = Math.max(0, nextQualification.votesYes - 1);
    } else if (type === "neutral") {
      nextQualification.votesNeutral = Math.max(
        0,
        nextQualification.votesNeutral - 1,
      );
    } else {
      nextQualification.votesNo = Math.max(0, nextQualification.votesNo - 1);
    }
    nextSelectedVote = null;
  } else {
    if (selectedVote === "yes") {
      nextQualification.votesYes = Math.max(0, nextQualification.votesYes - 1);
    } else if (selectedVote === "neutral") {
      nextQualification.votesNeutral = Math.max(
        0,
        nextQualification.votesNeutral - 1,
      );
    } else if (selectedVote === "no") {
      nextQualification.votesNo = Math.max(0, nextQualification.votesNo - 1);
    }

    if (type === "yes") {
      nextQualification.votesYes += 1;
    } else if (type === "neutral") {
      nextQualification.votesNeutral += 1;
    } else {
      nextQualification.votesNo += 1;
    }
    nextSelectedVote = type;
  }

  return { qualification: nextQualification, selectedVote: nextSelectedVote };
}
