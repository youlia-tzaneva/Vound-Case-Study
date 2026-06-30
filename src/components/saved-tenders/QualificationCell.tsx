import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";
import type { TenderQualification } from "../../types/tender";
import type { VoteType } from "../../utils/applyVote";
import { withIconClass } from "../ui/iconProps";

interface QualificationCellProps {
  qualification: TenderQualification;
  onVote: (type: VoteType) => void;
}

export function QualificationCell({
  qualification,
  onVote,
}: QualificationCellProps) {

  return (
    <div
      className="flex flex-col gap-3xs whitespace-nowrap"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-xs">
        <span>Votes:</span>
        <div className="group/votes grid justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
          <span className="group-hover/votes:invisible">
            <span className="text-scoring-high">{qualification.votesYes}</span>
            {" / "}
            {qualification.votesNeutral}
            {" / "}
            <span className="text-scoring-low">{qualification.votesNo}</span>
          </span>

          <div className="invisible flex gap-4xs group-hover/votes:visible">
            <InlineVoteButton
              ariaLabel="Positiv abstimmen"
              count={qualification.votesYes}
              onClick={() => onVote("yes")}
              className="border-scoring-high bg-status-success-bg"
            >
              <ThumbsUp {...withIconClass("text-scoring-high")} size={12} />
            </InlineVoteButton>
            <InlineVoteButton
              ariaLabel="Neutral abstimmen"
              count={qualification.votesNeutral}
              onClick={() => onVote("neutral")}
              className="border-border-dark bg-bg-light"
            >
              <span>-</span>
            </InlineVoteButton>
            <InlineVoteButton
              ariaLabel="Negativ abstimmen"
              count={qualification.votesNo}
              onClick={() => onVote("no")}
              className="border-scoring-low bg-status-rejected-bg"
            >
              <ThumbsDown {...withIconClass("text-scoring-low")} size={12} />
            </InlineVoteButton>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-xs">
        <span>Relevanz-Score:</span>
        <span>{qualification.relevanzScore}</span>
      </div>
      <div className="flex items-center justify-between gap-xs">
        <span>Komplexität-Score:</span>
        <span>{qualification.komplexitaetScore}</span>
      </div>
    </div>
  );
}

function InlineVoteButton({
  ariaLabel,
  count,
  onClick,
  className,
  children,
}: {
  ariaLabel: string;
  count: number;
  onClick: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex items-center gap-4xs rounded-pill border px-4xs py-[2px] text-badge text-text-primary ${className}`}
    >
      {children}
      {count}
    </button>
  );
}
