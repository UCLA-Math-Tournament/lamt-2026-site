'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type CSSProperties, type PointerEvent } from 'react';

type SplitExample = {
  rejectedHtml: string;
  acceptedHtml: string;
};

type SplitStyle = CSSProperties & {
  '--split-x': string;
};

export default function AnswerSplitClient({ examples }: { examples: SplitExample[] }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const [paused, setPaused] = useState(false);
  const active = examples[activeIndex] || examples[0];

  useEffect(() => {
    if (reduceMotion || paused || examples.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % examples.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [examples.length, paused, reduceMotion]);

  function moveSplit(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(58, Math.max(42, next)));
  }

  const splitStyle: SplitStyle = {
    '--split-x': `${split}%`,
    gridTemplateColumns: `${split}% ${100 - split}%`,
  };

  return (
    <div className="answer-split">
      <div
        className="answer-split__stage"
        style={splitStyle}
        onPointerMove={moveSplit}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          setPaused(false);
          setSplit(50);
        }}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <section className="answer-split__side answer-split__side--rejected" aria-label="Rejected answer form">
          <span>Rejected</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={`rejected-${activeIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              dangerouslySetInnerHTML={{ __html: active.rejectedHtml }}
            />
          </AnimatePresence>
        </section>

        <section className="answer-split__side answer-split__side--accepted" aria-label="Accepted answer form">
          <span>Accepted</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={`accepted-${activeIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              dangerouslySetInnerHTML={{ __html: active.acceptedHtml }}
            />
          </AnimatePresence>
        </section>

        <span className="answer-split__divider" aria-hidden="true" />
      </div>

      <div className="answer-split__controls" role="group" aria-label="Answer format examples">
        {examples.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === activeIndex}
            className="answer-split__control"
            onClick={() => setActiveIndex(index)}
          >
            <span className="sr-only">Answer format example {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
