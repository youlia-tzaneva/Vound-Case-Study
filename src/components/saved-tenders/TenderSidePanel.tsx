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
import type { ReactNode } from "react";
import { Badge, statusToVariant, urgencyToVariant } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { withIconClass } from "../ui/iconProps";
import type { TenderPanelView } from "../../types/tender";
import { statusLabels } from "../../data/mockTenders";

interface TenderSidePanelProps {
  tender: TenderPanelView;
  onClose: () => void;
}

export function TenderSidePanel({ tender, onClose }: TenderSidePanelProps) {
  return (
    <aside
      aria-label={`Projektdetails: ${tender.name}`}
      className="flex h-full w-[644px] max-w-full flex-col gap-m overflow-y-auto rounded-tl-[8px] rounded-bl-[8px] border-l border-border-light bg-bg-containers p-m"
    >
      <header className="flex shrink-0 items-start gap-xs">
        <div className="min-w-0 flex-1">
          <h2 className="text-h3 break-words text-text-primary">{tender.name}</h2>
          <p className="mt-3xs text-body text-text-secondary">{tender.location}</p>
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

        <SidebarSection tender={tender} />
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
            {tender.urgency && tender.urgencyLabel && (
              <Badge variant={urgencyToVariant(tender.urgency)}>
                {tender.urgencyLabel}
              </Badge>
            )}
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
          <p className="text-body text-text-primary">{tender.buyer}</p>
        </Field>
        <Field label="Volumen">
          <p className="text-body text-text-primary">{tender.volumen}</p>
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
            <p className="text-body text-text-primary">{tender.leistungsart}</p>
          </Field>
          <Field label="LP">
            <p className="text-body text-text-primary">{tender.lp}</p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-xs">
          <Field label="Gebäudetyp">
            <p className="text-body text-text-primary">{tender.gebaeudetyp}</p>
          </Field>
          <Field label="Verfahrensart">
            <p className="text-body text-text-primary">{tender.verfahrensart}</p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-xs">
          <Field label="Entfernung">
            <p className="text-body text-text-primary">{tender.entfernung}</p>
          </Field>
          <Field label="Upload-Datum">
            <p className="text-body text-text-primary">{tender.uploadDate}</p>
          </Field>
        </div>
      </div>
    </section>
  );
}

function SidebarSection({ tender }: { tender: TenderPanelView }) {
  return (
    <aside className="flex w-[197px] shrink-0 flex-col gap-m rounded-container border border-border-light p-xs">
      <section className="flex flex-col gap-xs">
        <h3 className="text-eyebrow text-text-primary">Team</h3>

        <Field label="Projekt Owner">
          <SelectField>
            {tender.owner ? (
              <>
                <Avatar
                  initials={tender.owner.initials}
                  color={tender.owner.color}
                />
                <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                  {tender.owner.name}
                </span>
              </>
            ) : (
              <span className="text-body text-text-secondary">Unbekannt</span>
            )}
          </SelectField>
        </Field>

        <Field label="Team">
          <SelectField>
            <span className="min-w-0 flex-1 truncate text-body text-text-primary">
              {tender.team}
            </span>
          </SelectField>
        </Field>

        <Field label="Partner">
          <SelectField>
            <span className="min-w-0 flex-1 truncate text-body text-text-primary">
              {tender.partner}
            </span>
          </SelectField>
        </Field>
      </section>

      <section className="flex flex-col gap-xs">
        <h3 className="text-eyebrow text-text-primary">Qualifikation</h3>

        <Field label="Votes">
          <VoteBadges qualification={tender.qualification} />
        </Field>

        <Field label="Relevanz-Score">
          <ScoreIcons
            score={tender.qualification.relevanzScore}
            icon={Star}
            filledClassName="fill-status-progress-text text-status-progress-text"
            emptyClassName="text-border-dark"
          />
        </Field>

        <Field label="Komplexität-Score">
          <ScoreIcons
            score={tender.qualification.komplexitaetScore}
            icon={Wrench}
            filledClassName="text-scoring-low"
            emptyClassName="text-border-dark"
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
        <Field label="Updates">
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
              <p className="px-3xs py-3xs text-table text-text-primary">
                Unbekannt
              </p>
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
              <p className="px-3xs text-table text-text-primary">Unbekannt</p>
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
            <div className="flex gap-xs">
              <p className="max-w-[324px] flex-1 text-table text-text-primary">
                {tender.timelineDescription}
              </p>
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
    <div className="flex flex-col gap-4xs">
      <span className="text-filter-label text-text-primary">{label}</span>
      {children}
    </div>
  );
}

function SelectField({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4xs rounded-[2px] border border-border-light px-3xs py-4xs">
      <div className="flex min-w-0 flex-1 items-center gap-4xs">{children}</div>
      <ChevronDown {...withIconClass()} size={24} />
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
}: {
  qualification: TenderPanelView["qualification"];
}) {
  return (
    <div className="flex flex-wrap gap-3xs">
      <span className="inline-flex items-center gap-4xs rounded-pill border border-scoring-high bg-status-success-bg px-3xs py-[2px] text-badge text-text-primary">
        <ThumbsUp {...withIconClass("text-scoring-high")} size={12} />
        {qualification.votesYes}
      </span>
      <span className="inline-flex items-center gap-4xs rounded-pill border border-border-dark bg-bg-light px-3xs py-[2px] text-badge text-text-primary">
        <span>-</span>
        {qualification.votesNeutral}
      </span>
      <span className="inline-flex items-center gap-4xs rounded-pill border border-scoring-low bg-status-rejected-bg px-3xs py-[2px] text-badge text-text-primary">
        <ThumbsDown {...withIconClass("text-scoring-low")} size={12} />
        {qualification.votesNo}
      </span>
    </div>
  );
}

function ScoreIcons({
  score,
  icon: Icon,
  filledClassName,
  emptyClassName,
}: {
  score: number;
  icon: LucideIcon;
  filledClassName: string;
  emptyClassName: string;
}) {
  return (
    <div className="flex gap-4xs">
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          {...withIconClass(index < score ? filledClassName : emptyClassName)}
          size={16}
          fill={Icon === Star && index < score ? "currentColor" : "none"}
        />
      ))}
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
      <div className="flex flex-col gap-4xs">
        <div className="flex flex-wrap items-center gap-3xs">
          <Bell
            {...withIconClass(
              highlighted ? "text-status-info-text" : "text-text-disabled",
            )}
            size={16}
          />
          <span className="text-body text-text-primary">{update.title}</span>
          <span className="text-small text-text-secondary">
            {update.timestamp}
          </span>
        </div>
        <p className="pl-s text-table text-text-primary">{update.description}</p>
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
        <Avatar initials={comment.author.initials} color={comment.author.color} />
        <span className="text-body text-text-primary">{comment.author.name}</span>
        <span className="text-small text-text-secondary">{comment.timestamp}</span>
      </div>
      <p className="pl-[28px] text-table text-text-primary">{comment.preview}</p>
    </div>
  );
}

function Timeline({
  events,
}: {
  events: TenderPanelView["timelineEvents"];
}) {
  return (
    <div className="flex min-w-[184px] gap-xs">
      <div className="relative flex w-2 flex-col items-center">
        {events.map((_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center">
            <span className="size-2 rounded-full bg-border-dark" />
            {index < events.length - 1 && (
              <span className="w-px flex-1 bg-border-light" />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-s">
        {events.map((event) => (
          <div key={event.label} className="flex flex-col gap-4xs">
            <span className="text-small text-text-secondary">{event.label}</span>
            <span className="text-table text-text-primary">{event.value}</span>
          </div>
        ))}
      </div>
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
            className="flex items-center justify-center gap-3xs rounded-container bg-bg-light px-2xs py-2xs"
          >
            <span className="text-body text-text-primary">{tab.label}</span>
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
            <div className="flex items-center justify-between px-xs py-3xs">
              <div className="flex items-center gap-3xs">
                <span className="text-body text-text-primary">{section.label}</span>
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
