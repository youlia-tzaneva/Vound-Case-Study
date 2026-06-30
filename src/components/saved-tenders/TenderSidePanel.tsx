import {
  Bell,
  ChevronDown,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Badge, statusToVariant } from "../ui/Badge";
import { DeadlineUrgencyText } from "./DeadlineUrgencyText";
import { Avatar } from "../ui/Avatar";
import { withIconClass } from "../ui/iconProps";
import type {
  TenderOwner,
  TenderPanelView,
  TenderQualification,
  TenderSidebarUpdates,
} from "../../types/tender";
import {
  currentUser,
  panelPartners,
  panelTeams,
  panelUsers,
  statusLabels,
} from "../../data/mockTenders";
import type { VoteType } from "../../utils/applyVote";
import { PanelDropdown, PanelDropdownOption } from "./PanelDropdown";
import { SIDE_PANEL_DROPDOWN_Z_INDEX } from "./useFixedDropdownStyle";
import { PanelText } from "./PanelText";

interface TenderSidePanelProps {
  tender: TenderPanelView;
  userVote: VoteType | null;
  onClose: () => void;
  onUpdate: (updates: TenderSidebarUpdates) => void;
  onVote: (type: VoteType, qualification: TenderQualification) => void;
}

type PanelCornerRadius = "both" | "top" | "none" | "bottom";

const SCROLL_THRESHOLD = 1;

const cornerRadiusClass: Record<PanelCornerRadius, string> = {
  both: "rounded-tl-[8px] rounded-bl-[8px]",
  top: "rounded-tl-[8px]",
  none: "",
  bottom: "rounded-bl-[8px]",
};

function resolveCornerRadius(element: HTMLElement): PanelCornerRadius {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const hasOverflow = scrollHeight - clientHeight > SCROLL_THRESHOLD;

  if (!hasOverflow) {
    return "both";
  }

  const atTop = scrollTop <= SCROLL_THRESHOLD;
  const atBottom =
    scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;

  if (atTop) {
    return "top";
  }

  if (atBottom) {
    return "bottom";
  }

  return "none";
}

export function TenderSidePanel({
  tender,
  userVote,
  onClose,
  onUpdate,
  onVote,
}: TenderSidePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [cornerRadius, setCornerRadius] = useState<PanelCornerRadius>("top");

  const updateCornerRadius = useCallback(() => {
    const element = panelRef.current;
    if (!element) {
      return;
    }

    setCornerRadius(resolveCornerRadius(element));
  }, []);

  useEffect(() => {
    const element = panelRef.current;
    if (!element) {
      return;
    }

    element.scrollTop = 0;
    updateCornerRadius();

    element.addEventListener("scroll", updateCornerRadius, { passive: true });

    const resizeObserver = new ResizeObserver(updateCornerRadius);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateCornerRadius);
      resizeObserver.disconnect();
    };
  }, [tender.id, updateCornerRadius]);

  return (
    <aside
      ref={panelRef}
      aria-label={`Projektdetails: ${tender.name}`}
      className={`flex h-full w-[644px] max-w-full flex-col gap-m overflow-y-auto border-l border-border-light bg-bg-containers p-m ${cornerRadiusClass[cornerRadius]}`}
    >
      <header className="flex shrink-0 items-start gap-xs">
        <div className="min-w-0 flex-1">
          <PanelText as="h2" className="text-h3 text-text-primary">
            {tender.name}
          </PanelText>
          <PanelText
            as="p"
            className="mt-3xs text-body text-text-secondary"
          >
            {tender.location}
          </PanelText>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Seitenleiste schließen"
          className="shrink-0 text-icon-default hover:text-icon-hover"
        >
          <X {...withIconClass()} size={24} />
        </button>
      </header>

      <div className="flex shrink-0 gap-xs">
        <div className="flex min-w-0 flex-1 flex-col gap-[60px] py-xs">
          <OverviewSection tender={tender} />
          <ProjectDetailsSection tender={tender} />
        </div>

        <SidebarSection
          tender={tender}
          userVote={userVote}
          onUpdate={onUpdate}
          onVote={onVote}
        />
      </div>

      <ActivitySection tender={tender} />
    </aside>
  );
}

function OverviewSection({ tender }: { tender: TenderPanelView }) {
  return (
    <section className="flex flex-col gap-xs">
      <h3 className="text-eyebrow text-text-primary">Überblick</h3>

      <div className="grid grid-cols-2 gap-xs">
        <Field label="Abgabefrist">
          <div className="flex flex-col gap-4xs">
            <DeadlineUrgencyText deadline={tender.deadline} urgency={tender.urgency} />
            <DeadlineText deadline={tender.deadline} />
          </div>
        </Field>

        <Field label="Status">
          <Badge variant={statusToVariant(tender.status)}>
            {statusLabels[tender.status]}
          </Badge>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-xs">
        <Field label="Buyer">
          <PanelText className="text-body text-text-primary">{tender.buyer}</PanelText>
        </Field>
        <Field label="Volumen">
          <PanelText className="text-body text-text-primary">{tender.volumen}</PanelText>
        </Field>
      </div>
    </section>
  );
}

function ProjectDetailsSection({ tender }: { tender: TenderPanelView }) {
  return (
    <section className="flex flex-col gap-xs">
      <h3 className="text-eyebrow text-text-primary">Projektdetails</h3>

      <div className="flex flex-col gap-xs">
        <div className="grid grid-cols-2 gap-xs">
          <Field label="Leistungsart">
            <PanelText className="text-body text-text-primary">
              {tender.leistungsart}
            </PanelText>
          </Field>
          <Field label="LP">
            <PanelText className="text-body text-text-primary">{tender.lp}</PanelText>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-xs">
          <Field label="Gebäudetyp">
            <PanelText className="text-body text-text-primary">
              {tender.gebaeudetyp}
            </PanelText>
          </Field>
          <Field label="Verfahrensart">
            <PanelText className="text-body text-text-primary">
              {tender.verfahrensart}
            </PanelText>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-xs">
          <Field label="Entfernung">
            <PanelText className="text-body text-text-primary">
              {tender.entfernung}
            </PanelText>
          </Field>
          <Field label="Upload-Datum">
            <PanelText className="text-body text-text-primary">
              {tender.uploadDate}
            </PanelText>
          </Field>
        </div>
      </div>
    </section>
  );
}

function SidebarSection({
  tender,
  userVote,
  onUpdate,
  onVote,
}: {
  tender: TenderPanelView;
  userVote: VoteType | null;
  onUpdate: (updates: TenderSidebarUpdates) => void;
  onVote: (type: VoteType, qualification: TenderQualification) => void;
}) {
  const [owner, setOwner] = useState<TenderOwner | null>(tender.owner);
  const [team, setTeam] = useState(tender.team);
  const [partner, setPartner] = useState(tender.partner);
  const [qualification, setQualification] = useState(tender.qualification);
  const [openDropdown, setOpenDropdown] = useState<
    "owner" | "team" | "partner" | null
  >(null);

  useEffect(() => {
    setOwner(tender.owner);
    setTeam(tender.team);
    setPartner(tender.partner);
    setQualification(tender.qualification);
    setOpenDropdown(null);
  }, [
    tender.id,
    tender.owner,
    tender.team,
    tender.partner,
    tender.qualification,
  ]);

  const toggleDropdown = (id: "owner" | "team" | "partner") => {
    setOpenDropdown((current) => (current === id ? null : id));
  };

  const handleVote = (type: VoteType) => {
    onVote(type, qualification);
  };

  return (
    <aside className="flex w-[197px] shrink-0 flex-col gap-m rounded-container border border-border-light p-xs">
      <section className="flex flex-col gap-xs">
        <h3 className="text-eyebrow text-text-primary">Team</h3>

        <Field label="Projekt Owner">
          <PanelDropdown
            isOpen={openDropdown === "owner"}
            onToggle={() => toggleDropdown("owner")}
            onClose={() => setOpenDropdown(null)}
            menuZIndex={SIDE_PANEL_DROPDOWN_Z_INDEX}
            ariaLabel="Projekt Owner auswählen"
            trigger={
              owner ? (
                <>
                  <Avatar
                    name={owner.name}
                    initials={owner.initials}
                    color={owner.color}
                    avatarUrl={owner.avatarUrl}
                  />
                  <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                    {owner.name}
                  </span>
                </>
              ) : (
                <span className="text-body text-text-secondary">Unbekannt</span>
              )
            }
          >
            {panelUsers.map((user) => (
              <PanelDropdownOption
                key={user.name}
                isSelected={owner?.name === user.name}
                onSelect={() => {
                  setOwner(user);
                  onUpdate({ owner: user });
                  setOpenDropdown(null);
                }}
              >
                <Avatar
                  name={user.name}
                  initials={user.initials}
                  color={user.color}
                  avatarUrl={user.avatarUrl}
                />
                <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                  {user.name}
                </span>
              </PanelDropdownOption>
            ))}
          </PanelDropdown>
        </Field>

        <Field label="Team">
          <PanelDropdown
            isOpen={openDropdown === "team"}
            onToggle={() => toggleDropdown("team")}
            onClose={() => setOpenDropdown(null)}
            menuZIndex={SIDE_PANEL_DROPDOWN_Z_INDEX}
            ariaLabel="Team auswählen"
            trigger={
              <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                {team}
              </span>
            }
          >
            {panelTeams.map((option) => (
              <PanelDropdownOption
                key={option}
                isSelected={team === option}
                onSelect={() => {
                  setTeam(option);
                  onUpdate({ team: option });
                  setOpenDropdown(null);
                }}
              >
                <span className="text-body text-text-primary">{option}</span>
              </PanelDropdownOption>
            ))}
          </PanelDropdown>
        </Field>

        <Field label="Partner">
          <PanelDropdown
            isOpen={openDropdown === "partner"}
            onToggle={() => toggleDropdown("partner")}
            onClose={() => setOpenDropdown(null)}
            menuZIndex={SIDE_PANEL_DROPDOWN_Z_INDEX}
            ariaLabel="Partner auswählen"
            trigger={
              <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                {partner}
              </span>
            }
          >
            {panelPartners.map((option) => (
              <PanelDropdownOption
                key={option}
                isSelected={partner === option}
                onSelect={() => {
                  setPartner(option);
                  onUpdate({ partner: option });
                  setOpenDropdown(null);
                }}
              >
                <span className="text-body text-text-primary">{option}</span>
              </PanelDropdownOption>
            ))}
          </PanelDropdown>
        </Field>
      </section>

      <section className="flex flex-col gap-xs">
        <h3 className="text-eyebrow text-text-primary">Qualifikation</h3>

        <Field label="Votes">
          <VoteBadges
            qualification={qualification}
            userVote={userVote}
            onVote={handleVote}
          />
        </Field>

        <Field label="Relevanz-Score">
          <ScoreIcons
            score={qualification.relevanzScore}
            icon={Star}
            filledClassName="text-text-primary"
            filledFillColor="var(--color-scoring-relevance)"
            emptyClassName="text-border-dark"
            onScoreChange={(score) => {
              const nextQualification = {
                ...qualification,
                relevanzScore: score,
              };
              setQualification(nextQualification);
              onUpdate({ qualification: nextQualification });
            }}
            ariaLabel="Relevanz-Score"
          />
        </Field>

        <Field label="Komplexität-Score">
          <ScoreIcons
            score={qualification.komplexitaetScore}
            icon={Wrench}
            filledClassName="fill-scoring-low text-scoring-low"
            emptyClassName="text-border-dark"
            onScoreChange={(score) => {
              const nextQualification = {
                ...qualification,
                komplexitaetScore: score,
              };
              setQualification(nextQualification);
              onUpdate({ qualification: nextQualification });
            }}
            ariaLabel="Komplexität-Score"
          />
        </Field>
      </section>
    </aside>
  );
}

function ActivitySection({ tender }: { tender: TenderPanelView }) {
  return (
    <section className="flex shrink-0 flex-col gap-xs">
      <h3 className="text-eyebrow text-text-primary">Aktivität</h3>

      <div className="flex flex-col gap-xs">
        <Field label="Aktualisierungen">
          <div className="rounded-[2px] border border-border-light p-3xs">
            {tender.updates.length > 0 ? (
              tender.updates.map((update, index) => (
                <UpdateItem
                  key={`${update.timestamp}-${index}`}
                  update={update}
                  highlighted={index === 0 && update.isNew}
                />
              ))
            ) : (
              <PanelText className="px-3xs py-3xs text-table text-text-primary">
                Unbekannt
              </PanelText>
            )}
          </div>
        </Field>

        <Field label="Notizen / Kommentare">
          <div className="flex flex-col gap-xs rounded-[2px] border border-border-light px-3xs py-xs">
            {tender.comments.length > 0 ? (
              tender.comments.map((comment) => (
                <CommentItem key={`${comment.author.name}-${comment.timestamp}`} comment={comment} />
              ))
            ) : (
              <PanelText className="px-3xs text-table text-text-primary">
                Unbekannt
              </PanelText>
            )}

            <div className="flex items-center gap-3xs rounded-[2px] border border-border-light px-3xs py-4xs">
              <input
                type="text"
                placeholder="Notizen zum Verfahren..."
                aria-label="Notizen zum Verfahren"
                className="min-w-0 flex-1 border-0 bg-transparent text-table text-text-primary outline-none placeholder:text-text-secondary"
              />
              <Send
                {...withIconClass("text-icon-default")}
                size={16}
              />
            </div>
          </div>
        </Field>

        <Field label="Zeitleiste">
          <div className="rounded-[2px] border border-border-light px-xs py-xs">
            <div className="flex gap-m">
              <PanelText className="max-w-[324px] flex-1 text-table text-text-primary">
                {tender.timelineDescription}
              </PanelText>
              <Timeline events={tender.timelineEvents} />
            </div>
          </div>
        </Field>

        <Field label="Anforderungen">
          <RequirementsPanel requirements={tender.requirements} />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4xs">
      <span className="break-hyphenate text-filter-label text-text-primary">
        {label}
      </span>
      {children}
    </div>
  );
}

function DeadlineText({ deadline }: { deadline: string }) {
  const [date, time] = deadline.split(" | ");

  return (
    <span className="whitespace-nowrap text-body text-text-primary">
      {date}
      <span className="text-border-dark"> | </span>
      {time}
    </span>
  );
}

function VoteBadges({
  qualification,
  userVote,
  onVote,
}: {
  qualification: TenderPanelView["qualification"];
  userVote: VoteType | null;
  onVote: (type: VoteType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3xs">
      <button
        type="button"
        onClick={() => onVote("yes")}
        aria-label="Positiv abstimmen"
        className="inline-flex items-center gap-4xs rounded-container border border-scoring-high bg-status-success-bg px-3xs py-[2px] text-badge text-text-primary"
      >
        <ThumbsUp {...withIconClass("text-scoring-high")} size={12} />
        {qualification.votesYes}
        {userVote === "yes" && (
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            color={currentUser.color}
            avatarUrl={currentUser.avatarUrl}
            size={14}
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onVote("neutral")}
        aria-label="Neutral abstimmen"
        className="inline-flex items-center gap-4xs rounded-container border border-border-dark bg-bg-light px-3xs py-[2px] text-badge text-text-primary"
      >
        <span>-</span>
        {qualification.votesNeutral}
        {userVote === "neutral" && (
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            color={currentUser.color}
            avatarUrl={currentUser.avatarUrl}
            size={14}
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onVote("no")}
        aria-label="Negativ abstimmen"
        className="inline-flex items-center gap-4xs rounded-container border border-scoring-low bg-status-rejected-bg px-3xs py-[2px] text-badge text-text-primary"
      >
        <ThumbsDown {...withIconClass("text-scoring-low")} size={12} />
        {qualification.votesNo}
        {userVote === "no" && (
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            color={currentUser.color}
            avatarUrl={currentUser.avatarUrl}
            size={14}
          />
        )}
      </button>
    </div>
  );
}

function ScoreIcons({
  score,
  icon: Icon,
  filledClassName,
  filledFillColor,
  emptyClassName,
  onScoreChange,
  ariaLabel,
}: {
  score: number;
  icon: LucideIcon;
  filledClassName: string;
  filledFillColor?: string;
  emptyClassName: string;
  onScoreChange: (score: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex gap-4xs" role="group" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const isFilled = index < score;

        return (
          <button
            key={index}
            type="button"
            aria-label={`${value} von 5`}
            aria-pressed={isFilled}
            onClick={() => onScoreChange(value)}
            className="flex items-center justify-center"
          >
            <Icon
              {...withIconClass(isFilled ? filledClassName : emptyClassName)}
              size={16}
              fill={isFilled ? (filledFillColor ?? "currentColor") : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

function UpdateItem({
  update,
  highlighted,
}: {
  update: TenderPanelView["updates"][number];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`px-4xs py-3xs ${highlighted ? "rounded-container bg-status-info-bg" : ""}`}
    >
      <div className="flex gap-3xs">
        <Bell
          {...withIconClass(
            highlighted ? "text-status-info-text" : "text-text-disabled",
          )}
          size={16}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4xs">
          <span className="text-small text-text-secondary">
            {update.timestamp}
          </span>
          <PanelText className="text-table text-text-primary">
            {update.description}
          </PanelText>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
}: {
  comment: TenderPanelView["comments"][number];
}) {
  return (
    <div className="flex flex-col gap-4xs">
      <div className="flex flex-wrap items-center gap-3xs">
        <Avatar
          name={comment.author.name}
          initials={comment.author.initials}
          color={comment.author.color}
          avatarUrl={comment.author.avatarUrl}
        />
        <PanelText as="span" className="text-body text-text-primary">
          {comment.author.name}
        </PanelText>
        <span className="text-small text-text-secondary">{comment.timestamp}</span>
      </div>
      <PanelText className="pl-[28px] text-table text-text-primary">
        {comment.preview}
      </PanelText>
    </div>
  );
}

function Timeline({
  events,
}: {
  events: TenderPanelView["timelineEvents"];
}) {
  return (
    <div className="flex min-w-[184px] flex-col">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div
            key={event.label}
            className={`flex gap-xs ${!isLast ? "pb-s" : ""}`}
          >
            <div className="flex w-2 shrink-0 flex-col items-center">
              <div className="flex h-[17px] shrink-0 items-center">
                <span
                  className={`size-2 rounded-full ${
                    index === 0 ? "bg-text-primary" : "bg-border-dark"
                  }`}
                />
              </div>
              <div className="w-px flex-1 bg-border-light" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4xs">
              <PanelText
                as="span"
                className="text-small leading-[1.2] text-text-secondary"
              >
                {event.label}
              </PanelText>
              <PanelText as="span" className="text-table font-medium text-text-primary">
                {event.value}
              </PanelText>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RequirementsPanel({
  requirements,
}: {
  requirements: TenderPanelView["requirements"];
}) {
  const tabs = [
    { label: "Mindestkriterien", count: requirements.mindestkriterien },
    { label: "Wertung Teilnahme", count: requirements.wertungTeilnahme },
    { label: "Zuschlagskriterien", count: requirements.zuschlagskriterien },
  ];

  return (
    <div className="rounded-[2px] border border-border-light px-xs py-xs">
      <div className="grid grid-cols-3 gap-3xs">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className="flex min-w-0 items-center justify-center gap-3xs rounded-container bg-bg-light px-2xs py-2xs"
          >
            <PanelText as="span" className="text-body text-text-primary">
              {tab.label}
            </PanelText>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-bg-containers text-caption text-text-primary">
              {tab.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-xs flex flex-col">
        {requirements.sections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <hr className="border-border-light" />}
            <div className="flex min-w-0 items-center justify-between px-xs py-3xs">
              <div className="flex min-w-0 items-center gap-3xs">
                <PanelText as="span" className="text-body text-text-primary">
                  {section.label}
                </PanelText>
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-bg-light text-caption text-text-primary">
                  {section.count}
                </span>
              </div>
              <ChevronDown {...withIconClass()} size={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
