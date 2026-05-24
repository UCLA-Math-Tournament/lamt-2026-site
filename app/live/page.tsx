"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
  const heading = previewMode ? "Draft Announcements" : "Tournament Announcements";
  const reduceMotion = useReducedMotion();

  return (
    <section className="lamt-panel" aria-live="polite">
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
        <div className="live-announcement-list" role="status">
          <motion.div
            className="live-announcement-card live-announcement-card--empty"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="live-announcement-meta">
              <span className="live-latest-badge live-latest-badge--quiet">
                <span className="live-latest-badge__shine" aria-hidden="true" />
                <span>{previewMode ? "Draft" : TOURNAMENT_OVER ? "Archive" : "Official"}</span>
              </span>
            </div>
            <p className="section-copy">
              {previewMode
                ? "No draft announcements."
                : TOURNAMENT_OVER
                  ? "No announcements posted."
                  : "No announcements yet."}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="live-announcement-list" role="list">
          {updates.map((update, index) => (
            <motion.article
              key={update.id}
              className="live-announcement-card"
              data-latest={index === 0 ? "true" : undefined}
              role="listitem"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                delay: Math.min(index * 0.055, 0.18),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="live-announcement-meta">
                {index === 0 && (
                  <span className="live-latest-badge" aria-label="Latest announcement">
                    <span className="live-latest-badge__shine" aria-hidden="true" />
                    <span>Latest</span>
                  </span>
                )}
                <span className="live-announcement-time">{update.timestamp}</span>
              </div>
              {update.title && <h3 className="mb-3 text-xl font-extrabold text-[var(--color-text)]">{update.title}</h3>}
              <p className="section-copy whitespace-pre-line">{update.body}</p>
            </motion.article>
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
  const mailto = `mailto:${STAFF_EMAIL}?subject=${encodeURIComponent("LAMT 2026 question")}`;
  return (
    <section id="contact" className="section-row">
      <h2 className="section-title">Contact</h2>
      <div className="lamt-panel">
        <div className="lamt-panel-body grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-xl font-extrabold text-[var(--color-text)]">{STAFF_EMAIL}</h3>
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
              May 17, 2026. UCLA. Schedule, announcements, map.
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
