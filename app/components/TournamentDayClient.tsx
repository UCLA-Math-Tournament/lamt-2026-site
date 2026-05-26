'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';

const dayEvents = [
  { time: '8:00 AM', title: 'Check-In', place: 'Outside MS 4000A' },
  { time: '8:45 AM', title: 'Opening', place: 'MS 4000A' },
  { time: '9:15 AM', title: 'Team Round', place: 'MS 4000A / MS 5200' },
  { time: '10:30 AM', title: 'Individual Rounds', place: 'MS 4000A / MS 5200' },
  { time: '12:30 PM', title: 'Lunch', place: 'Court of Sciences' },
  { time: '2:45 PM', title: 'Guts Round', place: 'MS 4000A / MS 5200' },
  { time: '6:00 PM', title: 'Awards', place: 'MS 4000A' },
];

export default function TournamentDayClient() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = Boolean(useReducedMotion());
  const progress = dayEvents.length > 1 ? active / (dayEvents.length - 1) : 0;
  const activeEvent = dayEvents[active];

  useEffect(() => {
    if (reduceMotion || !isInView) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % dayEvents.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [isInView, reduceMotion]);

  return (
    <section ref={sectionRef} className="page-shell day-motion-section" aria-labelledby="day-motion-title">
      <div className="section-row day-motion-row">
        <h2 id="day-motion-title" className="section-title">Day</h2>
        <div className="day-motion">
          <div className="day-motion__stage" aria-label="LAMT event day sequence">
            <div className="day-motion__rail" aria-hidden="true">
              <motion.span
                className="day-motion__rail-fill"
                animate={{ scaleX: progress }}
                transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.div
              className="day-motion__bear"
              animate={{ left: `${progress * 100}%`, rotate: active % 2 === 0 ? -4 : 5 }}
              transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <Image src="/LAMTBear.png" alt="" width={54} height={54} />
            </motion.div>

            <div className="day-motion__stops">
              {dayEvents.map((event, index) => (
                <button
                  key={`${event.time}-${event.title}`}
                  type="button"
                  className="day-motion__stop"
                  data-active={index === active}
                  onClick={() => setActive(index)}
                >
                  <span>{event.time}</span>
                  <strong>{event.title}</strong>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.title}
              className="day-motion__detail"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{activeEvent.time}</span>
              <h3>{activeEvent.title}</h3>
              <p>{activeEvent.place}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
