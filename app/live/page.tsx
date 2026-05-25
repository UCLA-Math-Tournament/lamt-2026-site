"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import VenueMap from "../components/VenueMap";
import type { ScheduleItem, Update } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

const TOURNAMENT_OVER = true;

const STORAGE_KEYS = {
  schedule: "lamt_schedule",
  updates: "lamt_updates",
};

const STAFF_EMAIL = "uclamathtournament@gmail.com";

const ARCHIVE_UPDATES: Update[] = [
  {
    id: -1,
    timestamp: "May 17, 2026",
    title: "LAMT 2026 complete",
    body: "Problems, solutions, results, and the final schedule are available for review.",
  },
  {
    id: -2,
    timestamp: "Post-contest",
    title: "Questions after the tournament",
    body: `Email ${STAFF_EMAIL}. Include your school, team name, and the event you are asking about.`,
  },
];

const HELP_ITEMS = [
  { label: "Info Desk", tag: "Check-In", detail: "Outside MS 4000A.", href: null },
  { label: "Wi-Fi", tag: "Campus", detail: "UCLA-WEB.", href: null },
  { label: "Restrooms", tag: "Building", detail: "Near MS elevators.", href: null },
  { label: "Disputes", tag: "Scoring", detail: "Court of Sciences at lunch.", href: null },
  { label: "Emergency", tag: "Safety", detail: "911 or UCPD: 310-825-4321.", href: "tel:3108254321", action: "Call", tone: "alert" },
  { label: "Email LAMT", tag: "Contact", detail: STAFF_EMAIL, href: `mailto:${STAFF_EMAIL}`, action: "Email" },
];

function parseTime(value: string): number {
  const [time, period] = value.split(" ");
  const [hour, minute] = time.split(":").map(Number);
  let hours = hour;

  if (period === "PM" && hour !== 12) hours += 12;
  if (period === "AM" && hour === 12) hours = 0;

  return hours * 60 + minute;
}

function getTimelineState(schedule: ScheduleItem[], now: Date | null) {
  if (!now) return { currentIdx: -1, nextIdx: -1, progress: 0 };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentIdx = schedule.findIndex((item) => {
    const start = parseTime(item.time);
    const end = parseTime(item.end);
    return currentMinutes >= start && currentMinutes < end;
  });
  const nextIdx = schedule.findIndex((item) => currentMinutes < parseTime(item.time));

  if (currentIdx === -1) return { currentIdx, nextIdx, progress: 0 };

  const start = parseTime(schedule[currentIdx].time);
  const end = parseTime(schedule[currentIdx].end);
  const progress = Math.min(100, Math.max(0, ((currentMinutes - start) / (end - start)) * 100));

  return { currentIdx, nextIdx, progress };
}

function readStored<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

function LiveStatus({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const { currentIdx, nextIdx, progress } = getTimelineState(schedule, now);
  const current = schedule[currentIdx];
  const next = current ? schedule[currentIdx + 1] : schedule[nextIdx];
  const displayEvent = TOURNAMENT_OVER ? "LAMT 2026 concluded." : current?.event || next?.event || "Thanks for joining LAMT.";
  const displayMeta = TOURNAMENT_OVER ? "May 17, 2026 / UCLA" : `${(current || next)?.time}-${(current || next)?.end} / ${(current || next)?.location}`;

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">
            {TOURNAMENT_OVER ? "Tournament Complete" : current ? "Happening Now" : next ? "Next Up" : "Schedule Complete"}
          </h2>
        </div>
        {!TOURNAMENT_OVER && (
          <span className="inline-flex border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-3 py-1 text-sm font-extrabold uppercase text-[var(--ucla-blue-deep)]">
            Live
          </span>
        )}
      </div>

      <div className="lamt-panel-body">
        <p className="text-2xl font-extrabold text-[var(--color-text)]">{displayEvent}</p>
        {(TOURNAMENT_OVER || current || next) && (
          <p className="mt-2 text-lg font-bold text-[var(--color-text-secondary)]">
            {displayMeta}
          </p>
        )}
        {!TOURNAMENT_OVER && current && (
          <>
            <div className="mt-5 h-3 border-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <div className="h-full bg-[var(--ucla-gold)]" style={{ width: `${progress}%` }} />
            </div>
            {next && <p className="mt-3 text-sm font-bold text-[var(--color-text-muted)]">Next: {next.event} at {next.time}</p>}
          </>
        )}
        {!TOURNAMENT_OVER && !current && next && <p className="mt-3 text-sm font-bold text-[var(--color-text-muted)]">The next scheduled event starts at {next.time}.</p>}
      </div>
    </section>
  );
}

function ScheduleTimeline({ schedule }: { schedule: ScheduleItem[] }) {
  const { currentIdx, nextIdx } = getTimelineState(schedule, new Date());

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">LAMT 2026 Schedule</h2>
        </div>
      </div>
      <div className="live-schedule-list" aria-label="LAMT 2026 tournament day schedule">
        {schedule.map((item, index) => {
          const state = TOURNAMENT_OVER
            ? "archive"
            : index === currentIdx
              ? "now"
              : index === nextIdx
                ? "next"
                : index < currentIdx
                  ? "done"
                  : "upcoming";

          return (
            <article key={`${item.time}-${item.event}`} className="live-schedule-item" data-state={state}>
              <div className="live-schedule-time">
                {item.originalTime && <span>{item.originalTime}</span>}
                <strong>{item.time}-{item.end}</strong>
              </div>
              <div className="live-schedule-main">
                <h3>{item.event}</h3>
                {item.adjustmentReason && <p>{item.adjustmentReason}</p>}
              </div>
              <div className="live-schedule-place">{item.location}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="section-row">
      <h2 className="section-title">Venue</h2>
      <div>
        <p className="section-copy mb-6">
          Mathematical Sciences and Court of Sciences.
        </p>
        <VenueMap />
      </div>
    </section>
  );
}

function UpdatesFeed({ updates, previewMode }: { updates: Update[]; previewMode: boolean }) {
  const useArchiveUpdates = !previewMode && TOURNAMENT_OVER && updates.length === 0;
  const displayedUpdates = useArchiveUpdates ? ARCHIVE_UPDATES : updates;
  const heading = previewMode ? "Draft Announcements" : "Notices";
  const reduceMotion = useReducedMotion();
  const noticeHover = reduceMotion ? undefined : { x: 2 };

  function noticeStyle(index: number): CSSProperties {
    return {
      "--notice-delay": `${Math.min(index * 55, 180)}ms`,
      "--notice-rail-delay": `${Math.min(index * 55 + 60, 220)}ms`,
      "--notice-detail-delay": `${Math.min(index * 55 + 90, 250)}ms`,
    } as CSSProperties;
  }

  return (
    <section className="lamt-panel" aria-live="polite">
      <div className="lamt-panel-header">
        <div>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">{heading}</h2>
        </div>
        {(displayedUpdates.length > 0 || previewMode) && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="font-bold text-[var(--color-text-muted)]">
              {displayedUpdates.length === 0 ? "No notices" : `${displayedUpdates.length} ${displayedUpdates.length === 1 ? "notice" : "notices"}`}
            </span>
            {previewMode && (
              <span className="feed-mode-badge feed-mode-badge--preview">
                Staff Draft
              </span>
            )}
          </div>
        )}
      </div>
      {displayedUpdates.length === 0 ? (
        <div className="live-announcement-list" role="status">
          <motion.div
            className="live-announcement-card live-announcement-card--empty"
            data-mode={previewMode ? "preview" : TOURNAMENT_OVER ? "archive" : "posted"}
            style={noticeStyle(0)}
            whileHover={noticeHover}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="live-announcement-rail" aria-hidden="true" />
            <div className="live-announcement-shell">
              <span className="live-announcement-badge" aria-hidden="true">
                {previewMode ? "D" : TOURNAMENT_OVER ? "A" : "L"}
              </span>
              <div className="live-announcement-content">
                <div className="live-announcement-meta">
                  <span className="live-latest-badge live-latest-badge--quiet">
                    {previewMode ? "Draft" : TOURNAMENT_OVER ? "Archive" : "Official"}
                  </span>
                </div>
                <p className="section-copy live-announcement-copy">
                  {previewMode ? "No draft announcements." : "No announcements yet."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="live-announcement-list" role="list">
          {displayedUpdates.map((update, index) => {
            const status = previewMode ? "Draft" : useArchiveUpdates ? "" : index === 0 ? "Latest" : "Posted";
            const badge = previewMode ? "D" : useArchiveUpdates ? "" : index === 0 ? "L" : "P";

            return (
            <motion.article
              key={update.id}
              className="live-announcement-card"
              data-latest={index === 0 ? "true" : undefined}
              data-mode={useArchiveUpdates ? "archive" : previewMode ? "preview" : "posted"}
              role="listitem"
              style={noticeStyle(index)}
              whileHover={noticeHover}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="live-announcement-rail" aria-hidden="true" />
              <div className="live-announcement-shell">
                {badge && <span className="live-announcement-badge" aria-hidden="true">{badge}</span>}
                <div className="live-announcement-content">
                  <div className="live-announcement-meta">
                    {status && (
                      <span className="live-latest-badge" aria-label={`${status} announcement`}>
                        {status}
                      </span>
                    )}
                    <span className="live-announcement-time">{update.timestamp}</span>
                  </div>
                  <div className="live-announcement-copy">
                    {update.title && <h3>{update.title}</h3>}
                    <p className="section-copy whitespace-pre-line">{update.body}</p>
                  </div>
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PreviewModeNotice() {
  return (
    <section className="local-mode-notice" aria-label="Staff draft notice">
      <div>
        <p className="label-caps">Staff Draft</p>
        <h2>Draft view.</h2>
      </div>
      <p>
        Staff only.
      </p>
      <Link href="/live" className="btn-outline">
        Open Event Page
      </Link>
    </section>
  );
}

function HelpSection() {
  return (
    <section className="section-row">
      <h2 className="section-title">Day-of Info</h2>
      <div className="lamt-line-list live-help-grid">
        {HELP_ITEMS.map((item) => {
          const content = (
            <>
              <span className="live-help-card__tag">{item.tag}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
              {item.action && <em>{item.action}</em>}
            </>
          );

          return item.href ? (
            <a key={item.label} href={item.href} className="lamt-line-item live-help-card live-help-card--link" data-tone={item.tone}>
              {content}
            </a>
          ) : (
            <article key={item.label} className="lamt-line-item live-help-card">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ContactStaffSection() {
  const mailto = `mailto:${STAFF_EMAIL}?subject=${encodeURIComponent("LAMT 2026 question")}`;
  return (
    <section id="contact" className="section-row">
      <h2 className="section-title">Contact</h2>
      <div className="contact-strip">
        <div>
          <p className="label-caps">Email</p>
          <h3>{STAFF_EMAIL}</h3>
        </div>
        <a href={mailto} className="btn-filled">
          Email LAMT
        </a>
      </div>
    </section>
  );
}

export default function LivePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [updates, setUpdates] = useState<Update[]>(DEFAULT_UPDATES);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setPreviewMode(new URLSearchParams(window.location.search).get("preview") === "1");
  }, []);

  useEffect(() => {
    if (!previewMode) {
      setSchedule(DEFAULT_SCHEDULE);
      setUpdates(DEFAULT_UPDATES);
      return;
    }

    function syncStoredData() {
      try {
        setSchedule(readStored<ScheduleItem[]>(STORAGE_KEYS.schedule, DEFAULT_SCHEDULE));
        setUpdates(readStored<Update[]>(STORAGE_KEYS.updates, DEFAULT_UPDATES));
      } catch {}
    }

    syncStoredData();

    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.schedule || event.key === STORAGE_KEYS.updates) {
        syncStoredData();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [previewMode]);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">LAMT 2026</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Event Archive</h1>
          <p className="page-summary mt-5">
            May 17, 2026. Announcements, schedule, venue.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#announcements" className="btn-filled">
              Announcements
            </a>
            <a href="#schedule" className="btn-filled">
              Schedule
            </a>
            <a href="#map" className="btn-outline">
              Venue
            </a>
            <a href="#contact" className="btn-outline">
              Contact
            </a>
          </div>
        </div>
      </header>

      {previewMode && <PreviewModeNotice />}

      <section id="announcements" className="section-row">
        <h2 className="section-title">Announcements</h2>
        <UpdatesFeed updates={updates} previewMode={previewMode} />
      </section>

      <section id="schedule" className="section-row">
        <h2 className="section-title">Schedule</h2>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <LiveStatus schedule={schedule} />
          <ScheduleTimeline schedule={schedule} />
        </div>
      </section>

      <MapSection />

      {!TOURNAMENT_OVER && (
        <div id="reference">
          <HelpSection />
        </div>
      )}

      <ContactStaffSection />
    </div>
  );
}
