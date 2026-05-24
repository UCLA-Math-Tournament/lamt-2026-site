'use client';

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

type AboutRevealItem = {
  id: string;
  number: string;
  title: string;
  summary: string;
  detail: string;
  signal: string;
};

const revealItems: AboutRevealItem[] = [
  {
    id: 'ucla',
    number: '01',
    title: 'At UCLA',
    summary: 'Student-run math tournament on campus.',
    detail: 'UCLA students write, staff, and run the tournament.',
    signal: 'Student run',
  },
  {
    id: 'day',
    number: '02',
    title: 'Contest Day',
    summary: 'Rounds, lunch, Guts, disputes, awards.',
    detail: 'Check-in through awards on one UCLA schedule.',
    signal: 'In person',
  },
  {
    id: 'rounds',
    number: '03',
    title: 'Divisions & Rounds',
    summary: 'Individual, team, and fast-paced formats.',
    detail: 'Individual and team rounds reward exact answers.',
    signal: 'Competition',
  },
  {
    id: 'archive',
    number: '04',
    title: 'Archive',
    summary: 'Problems, solutions, and results stay posted.',
    detail: 'Problems, solutions, and results remain posted.',
    signal: 'Published',
  },
];

export default function AboutStickyReveal() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 62%', 'end 55%'],
  });
  const activeItem = revealItems[activeIndex] || revealItems[0];

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (reduceMotion) return;

    const lastIndex = revealItems.length - 1;
    const nextIndex = revealItems
      .map((_, index) => index / Math.max(lastIndex, 1))
      .reduce((closestIndex, point, index, points) => {
        const distance = Math.abs(latest - point);
        const closestDistance = Math.abs(latest - points[closestIndex]);
        return distance < closestDistance ? index : closestIndex;
      }, 0);

    setActiveIndex(nextIndex);
  });

  return (
    <section className="about-reveal" ref={sectionRef} aria-label="LAMT in brief">
      <div className="about-reveal__stage" aria-live="polite">
        <span className="label-caps">LAMT in Brief</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            className="about-reveal__current"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{activeItem.number}</p>
            <h3>{activeItem.title}</h3>
            <span>{activeItem.summary}</span>
          </motion.div>
        </AnimatePresence>

        <div className="about-reveal__rail">
          {revealItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="about-reveal__rail-node"
              aria-label={`Show ${item.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span>{item.number}</span>
            </button>
          ))}
        </div>
      </div>

      <ol className="about-reveal__steps">
        {revealItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.li
              key={item.id}
              className={`about-reveal__step${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'step' : undefined}
              onViewportEnter={() => setActiveIndex(index)}
              viewport={{ amount: 0.55, margin: '-12% 0px -30% 0px' }}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, delay: Math.min(index * 0.035, 0.12), ease: [0.16, 1, 0.3, 1] }
              }
            >
              <span className="about-reveal__step-number">{item.number}</span>
              <div>
                <strong>{item.signal}</strong>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
