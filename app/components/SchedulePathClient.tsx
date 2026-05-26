'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type SchedulePathItem = {
  time: string;
  end: string;
  event: string;
  location: string;
  originalTime?: string;
  adjustmentReason?: string;
};

export default function SchedulePathClient({
  items,
  ariaLabel,
}: {
  items: SchedulePathItem[];
  ariaLabel: string;
}) {
  const [active, setActive] = useState(0);
  const rowsRef = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = Boolean(useReducedMotion());
  const markerTop = items.length > 1 ? `${(active / (items.length - 1)) * 100}%` : '0%';

  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean) as HTMLElement[];
    if (rows.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index || 0);
        setActive(index);
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: [0.18, 0.36, 0.54] },
    );

    rows.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, [items.length]);

  return (
    <div className="schedule-path" aria-label={ariaLabel}>
      <div className="schedule-path__rail" aria-hidden="true">
        <motion.span
          className="schedule-path__bear"
          animate={{ top: markerTop, rotate: active % 2 === 0 ? -4 : 5 }}
          transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src="/LAMTBear.png" alt="" width={38} height={38} />
        </motion.span>
      </div>

      <div className="schedule-path__list" role="list">
        {items.map((item, index) => (
          <article
            key={`${item.time}-${item.event}`}
            ref={(node) => {
              rowsRef.current[index] = node;
            }}
            className="schedule-path__item"
            aria-current={index === active ? 'step' : undefined}
            data-active={index === active ? 'true' : undefined}
            data-index={index}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            role="listitem"
            tabIndex={0}
          >
            <div className="schedule-path__time">
              <strong>{item.time} - {item.end}</strong>
              {item.originalTime ? <span>{item.originalTime}</span> : null}
            </div>
            <div className="schedule-path__main">
              <h3>{item.event}</h3>
              {item.adjustmentReason ? <p>{item.adjustmentReason}</p> : null}
            </div>
            <strong className="schedule-path__place">{item.location}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
