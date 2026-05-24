'use client';

import { useMemo, useState } from 'react';

type ScheduleEntry = {
  time: string;
  end: string;
  event: string;
  location: string;
  note: string;
};

type PeriodId = 'all' | 'morning' | 'afternoon' | 'closing';

const periods: Array<{ id: PeriodId; label: string; summary: string }> = [
  { id: 'all', label: 'All', summary: 'Full LAMT 2026 schedule.' },
  { id: 'morning', label: 'Morning', summary: 'Check-in through individual rounds.' },
  { id: 'afternoon', label: 'Afternoon', summary: 'Lunch, disputes, Geometry, and Guts.' },
  { id: 'closing', label: 'Closing', summary: 'Activities and awards.' },
];

function parseTime(value: string): number {
  const [time, period] = value.split(' ');
  const [hour, minute] = time.split(':').map(Number);
  let hours = hour;

  if (period === 'PM' && hour !== 12) hours += 12;
  if (period === 'AM' && hour === 12) hours = 0;

  return hours * 60 + minute;
}

function getPeriod(item: ScheduleEntry): Exclude<PeriodId, 'all'> {
  const start = parseTime(item.time);

  if (start < 12 * 60 + 30) return 'morning';
  if (start < 16 * 60 + 15) return 'afternoon';
  return 'closing';
}

export default function TournamentScheduleTabs({ schedule }: { schedule: ScheduleEntry[] }) {
  const [activePeriod, setActivePeriod] = useState<PeriodId>('all');
  const annotatedSchedule = useMemo(
    () => schedule.map((item, index) => ({ ...item, index, period: getPeriod(item) })),
    [schedule]
  );
  const visibleSchedule = activePeriod === 'all'
    ? annotatedSchedule
    : annotatedSchedule.filter((item) => item.period === activePeriod);
  const activeMeta = periods.find((period) => period.id === activePeriod) || periods[0];
  const counts = periods.reduce<Record<PeriodId, number>>((acc, period) => {
    acc[period.id] = period.id === 'all'
      ? annotatedSchedule.length
      : annotatedSchedule.filter((item) => item.period === period.id).length;
    return acc;
  }, { all: 0, morning: 0, afternoon: 0, closing: 0 });

  return (
    <div className="schedule-tabs">
      <div className="schedule-tab-list" role="tablist" aria-label="Schedule filters">
        {periods.map((period) => {
          const isActive = period.id === activePeriod;
          return (
            <button
              key={period.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="schedule-period-panel"
              aria-label={`${period.label}, ${counts[period.id]} ${counts[period.id] === 1 ? 'event' : 'events'}`}
              className="schedule-tab"
              onClick={() => setActivePeriod(period.id)}
            >
              <span>{period.label}</span>
              <strong>{counts[period.id]}</strong>
            </button>
          );
        })}
      </div>

      <p className="schedule-filter-summary">{activeMeta.summary}</p>

      <div
        id="schedule-period-panel"
        className="schedule-filter-panel"
        role="tabpanel"
        aria-live="polite"
      >
        <div className="lamt-timeline" aria-label={`${activeMeta.label} LAMT 2026 schedule`}>
          {visibleSchedule.map(({ time, end, event, location, note, index }) => (
            <article key={`${time}-${event}`} className="lamt-timeline-item">
              <div className="lamt-timeline-node" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="lamt-timeline-card">
                <div>
                  <span className="lamt-timeline-time">{time}-{end}</span>
                  <h3>{event}</h3>
                </div>
                <p>{note}</p>
                <strong>{location}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
