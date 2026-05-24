"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ScheduleItem, Update } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

const TOURNAMENT_OVER = true;

const STORAGE_KEYS = {
  schedule: "lamt_schedule",
  updates: "lamt_updates",
};

const STAFF_EMAIL = "uclamathtournament@gmail.com";

const VENUES = [
  {
    id: "ms",
    shortLabel: "MS",
    detail: "Mathematical Sciences Building: MS 4000A and MS 5200.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Mathematical+Sciences+Building",
  },
  {
    id: "court",
    shortLabel: "Court",
    detail: "Lunch, disputes, and outdoor gathering point.",
    href: "https://www.google.com/maps/search/?api=1&query=Court+of+Sciences+UCLA",
  },
  {
    id: "parking",
    shortLabel: "P2",
    detail: "Parking Structure 2: closest public parking reference.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Parking+Structure+2",
  },
];

const HELP_ITEMS = [
  { label: "Info Desk", tag: "Check-In", detail: "Outside MS 4000A during morning arrival.", href: null },
  { label: "Wi-Fi", tag: "Campus", detail: "UCLA-WEB was available without a password.", href: null },
  { label: "Restrooms", tag: "Building", detail: "MS Building restrooms are near the elevators.", href: null },
  { label: "Disputes", tag: "Scoring", detail: "Disputes were handled at Court of Sciences during lunch.", href: null },
  { label: "Emergency", tag: "Safety", detail: "Call 911 or UCPD at 310-825-4321.", href: "tel:3108254321", action: "Call", tone: "alert" },
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
  const displayEvent = TOURNAMENT_OVER ? "LAMT 2026 has concluded." : current?.event || next?.event || "Thanks for joining LAMT.";
  const displayMeta = TOURNAMENT_OVER ? "May 17, 2026 / UCLA" : `${(current || next)?.time}-${(current || next)?.end} / ${(current || next)?.location}`;

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Status</p>
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
          <p className="label-caps">Schedule</p>
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
      <h2 className="section-title">Venue Reference</h2>
      <div>
        <p className="section-copy mb-6">
          LAMT 2026 was centered around the Mathematical Sciences Building, with lunch and disputes at the Court of Sciences.
        </p>
        <div className="venue-map-board" aria-label="LAMT 2026 UCLA venue reference">
          <span className="venue-map-board__label venue-map-board__label--north">UCLA North Campus</span>
          <span className="venue-map-board__route" aria-hidden="true" />
          {VENUES.map((venue) => (
            <a key={venue.id} className={`venue-marker venue-marker--${venue.id}`} href={venue.href} target="_blank" rel="noopener noreferrer">
              <strong>{venue.shortLabel}</strong>
              <span>{venue.detail}</span>
              <em>Open Map</em>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpdatesFeed({ updates, previewMode }: { updates: Update[]; previewMode: boolean }) {
  const heading = previewMode ? "Draft Announcements" : "Tournament Announcements";

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Announcements</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">{heading}</h2>
        </div>
        {(updates.length > 0 || previewMode) && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="font-bold text-[var(--color-text-muted)]">
              {updates.length === 0 ? "No updates" : `${updates.length} ${updates.length === 1 ? "update" : "updates"}`}
            </span>
            <span className={`feed-mode-badge ${previewMode ? "feed-mode-badge--preview" : ""}`}>
              {previewMode ? "Staff Draft" : "Posted"}
            </span>
          </div>
        )}
      </div>
      {updates.length === 0 ? (
        <div className="lamt-panel-body">
          <p className="section-copy">
            {previewMode
              ? "Staff draft announcements for review will appear here."
              : TOURNAMENT_OVER
                ? "No additional announcements were posted for LAMT 2026."
                : "Official tournament announcements will appear here."}
          </p>
        </div>
      ) : (
        <div>
          {updates.map((update, index) => (
            <article key={update.id} className="border-b-2 border-[var(--color-border)] p-5 last:border-b-0">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {index === 0 && (
                  <span className="border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-2 py-1 text-xs font-extrabold uppercase text-[var(--ucla-blue-deep)]">
                    Latest
                  </span>
                )}
                <span className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</span>
              </div>
              {update.title && <h3 className="mb-3 text-xl font-extrabold text-[var(--color-text)]">{update.title}</h3>}
              <p className="section-copy whitespace-pre-line">{update.body}</p>
            </article>
          ))}
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
        <h2>Showing draft schedule and announcements.</h2>
      </div>
      <p>
        Use this view to review staff drafts before publishing official tournament updates.
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
      <h2 className="section-title">Tournament Day Reference</h2>
      <div className="live-help-grid">
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
            <a key={item.label} href={item.href} className="live-help-card live-help-card--link" data-tone={item.tone}>
              {content}
            </a>
          ) : (
            <article key={item.label} className="live-help-card">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ContactStaffSection() {
  const mailto = `mailto:${STAFF_EMAIL}?subject=${encodeURIComponent("LAMT 2026 follow-up question")}`;
  return (
    <section id="contact" className="section-row">
      <h2 className="section-title">Contact</h2>
      <div className="lamt-panel">
        <div className="lamt-panel-body grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-xl font-extrabold text-[var(--color-text)]">Email LAMT for post-tournament questions.</h3>
            <p className="section-copy mt-2">
              For LAMT 2026 follow-up, use the tournament email address.
            </p>
          </div>
          <a href={mailto} className="btn-filled">
            Email LAMT
          </a>
        </div>
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
          <p className="page-kicker">Event Archive</p>
          <span className="gold-rule" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="page-title">LAMT 2026 Event Archive</h1>
            <p className="page-summary mt-5">
              Final schedule, posted announcements, UCLA venue references, and contact links from Sunday, May 17, 2026.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#announcements" className="btn-filled">
                Announcements
              </a>
              <a href="#schedule" className="btn-filled">
                Schedule
              </a>
              <a href="#map" className="btn-outline">
                Venue Reference
              </a>
              <a href="#contact" className="btn-outline">
                Contact
              </a>
            </div>
          </div>
          <Link href="/" aria-label="Back to LAMT home" className="hidden border-2 border-[var(--ucla-gold)] bg-[var(--color-surface)] p-4 lg:block">
            <Image src="/LAMTBear.png" alt="LAMT" width={150} height={150} priority className="h-36 w-36 object-contain" />
          </Link>
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

      <div id="reference">
        <HelpSection />
      </div>

      <ContactStaffSection />
    </div>
  );
}
