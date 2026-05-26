"use client";

import { useEffect, useState } from "react";
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
    title: "Materials posted",
    body: "Problems, solutions, and results are available.",
  },
  {
    id: -2,
    timestamp: "Post-contest",
    title: "Questions",
    body: STAFF_EMAIL,
  },
];

function readStored<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

function ScheduleTimeline({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <section className="live-schedule-block">
      <div className="live-schedule-list" aria-label="LAMT 2026 tournament day schedule">
        {schedule.map((item) => (
          <article key={`${item.time}-${item.event}`} className="live-schedule-item">
            <div className="live-schedule-time">
              <strong>{item.time} - {item.end}</strong>
              {item.originalTime && <span>{item.originalTime}</span>}
            </div>
            <div className="live-schedule-main">
              <h3>{item.event}</h3>
              {item.adjustmentReason && <p>{item.adjustmentReason}</p>}
            </div>
            <div className="live-schedule-place">{item.location}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="section-row">
      <h2 className="section-title">Venue</h2>
      <VenueMap />
    </section>
  );
}

function UpdatesFeed({ updates, previewMode }: { updates: Update[]; previewMode: boolean }) {
  const useArchiveUpdates = !previewMode && TOURNAMENT_OVER && updates.length === 0;
  const displayedUpdates = useArchiveUpdates ? ARCHIVE_UPDATES : updates;

  return (
    <section className="live-update-index" aria-live="polite">
      {displayedUpdates.length === 0 ? (
        <p className="section-copy">{previewMode ? "No preview notices." : "No announcements yet."}</p>
      ) : (
        <div className="live-update-list" role="list">
          {displayedUpdates.map((update, index) => {
            return (
            <article
              key={update.id}
              className="live-update-row"
              data-latest={index === 0 ? "true" : undefined}
              data-mode={useArchiveUpdates ? "archive" : previewMode ? "preview" : "posted"}
              role="listitem"
            >
              <time>{update.timestamp}</time>
              <div>
                {update.title && <h3>{update.title}</h3>}
                <p className="section-copy whitespace-pre-line">{update.body}</p>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PreviewModeNotice() {
  return (
    <section className="local-mode-notice local-mode-notice--preview" aria-label="Staff preview notice">
      <div>
        <p className="label-caps">Staff</p>
        <h2>Preview</h2>
      </div>
      <Link href="/live" className="btn-outline">
        Event Page
      </Link>
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
        <div className="page-hero__body">
          <h1 className="page-title">Event Day</h1>
          <p className="page-summary mt-5">
            May 17, 2026.
          </p>
        </div>
      </header>

      {previewMode && <PreviewModeNotice />}

      <section id="announcements" className="section-row">
        <h2 className="section-title">Notices</h2>
        <UpdatesFeed updates={updates} previewMode={previewMode} />
      </section>

      <section id="schedule" className="section-row">
        <h2 className="section-title">Schedule</h2>
        <ScheduleTimeline schedule={schedule} />
      </section>

      <MapSection />

      <ContactStaffSection />
    </div>
  );
}
