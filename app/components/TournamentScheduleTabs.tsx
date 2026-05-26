'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  { id: 'all', label: 'All', summary: 'Full schedule.' },
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
  const reduceMotion = useReducedMotion();
  const [activePeriod, setActivePeriod] = useState<PeriodId>('all');
  const annotatedSchedule = useMemo(
    () => schedule.map((item, index) => ({ ...item, index, period: getPeriod(item) })),
    [schedule]
  );
  const visibleSchedule = activePeriod === 'all'
    ? annotatedSchedule
    : annotatedSchedule.filter((item) => item.period === activePeriod);
  const activeMeta = periods.find((period) => period.id === activePeriod) || periods[0];
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
              aria-label={`${period.label} schedule`}
              className="schedule-tab"
              onClick={() => setActivePeriod(period.id)}
            >
              {isActive ? (
                <motion.span
                  className="schedule-tab-marker"
                  layoutId="schedule-tab-marker"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className="schedule-tab-label">{period.label}</span>
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePeriod}
            className="lamt-agenda"
            aria-label={`${activeMeta.label} LAMT 2026 schedule`}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {visibleSchedule.map(({ time, end, event, location, note }, visibleIndex) => (
              <motion.article
                key={`${time}-${event}`}
                className="lamt-agenda-item"
                initial={reduceMotion ? false : { opacity: 0, x: -2 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, delay: Math.min(visibleIndex * 0.025, 0.12), ease: [0.16, 1, 0.3, 1] }
                }
              >
                <div className="lamt-agenda-time">
                  <span>{time}</span>
                  <small>{end}</small>
                </div>
                <div className="lamt-agenda-main">
                  <h3>{event}</h3>
                  <p>{note}</p>
                </div>
                <strong className="lamt-agenda-place">{location}</strong>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
