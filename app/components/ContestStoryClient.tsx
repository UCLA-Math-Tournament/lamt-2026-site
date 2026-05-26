'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const storyPanels = [
  {
    label: 'Contest',
    title: ['Free', 'in person', 'at UCLA'],
    line: 'May 17, 2026. Middle and high school students.',
    facts: ['$0 registration', 'Teams up to six', 'UCLA Mathematical Sciences'],
    tone: 'blue',
  },
  {
    label: 'Rounds',
    title: ['Five', 'ways to', 'compete'],
    line: 'Individual, team, relay, collaboration, and Guts rounds.',
    facts: ['Exact work', 'Team strategy', 'Fast scoring'],
    tone: 'gold',
  },
  {
    label: 'Day',
    title: ['Check in', 'compete', 'awards'],
    line: 'A single campus schedule from morning check-in through awards.',
    facts: ['8:00 AM check-in', '12:30 PM lunch', '6:00 PM awards'],
    tone: 'blue',
  },
] as const;

function ContestLineWord({
  word,
  index,
  isLast,
  centerIndex,
  reduceMotion,
  scrollYProgress,
}: {
  word: string;
  index: number;
  isLast: boolean;
  centerIndex: number;
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const distance = index - centerIndex;
  const x = useTransform(scrollYProgress, [0.12, 0.42], reduceMotion ? [0, 0] : [distance * 12, 0]);
  const y = useTransform(scrollYProgress, [0.12, 0.42], reduceMotion ? [0, 0] : [Math.abs(distance) * 2.5 + 8, 0]);
  const opacity = useTransform(scrollYProgress, [0.12, 0.42], reduceMotion ? [1, 1] : [0.42, 1]);
  const rotateX = useTransform(scrollYProgress, [0.12, 0.42], reduceMotion ? [0, 0] : [distance * -2.5, 0]);

  return (
    <motion.span
      aria-hidden="true"
      className="contest-flow__line-word"
      style={{ opacity, rotateX, x, y }}
    >
      {word}{isLast ? '' : ' '}
    </motion.span>
  );
}

function ContestAnimatedLine({
  line,
  reduceMotion,
  scrollYProgress,
}: {
  line: string;
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const words = line.split(' ');
  const centerIndex = Math.floor(words.length / 2);

  return (
    <p className="contest-flow__line" aria-label={line}>
      {words.map((word, wordIndex) => (
        <ContestLineWord
          key={`${word}-${wordIndex}`}
          word={word}
          index={wordIndex}
          isLast={wordIndex === words.length - 1}
          centerIndex={centerIndex}
          reduceMotion={reduceMotion}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function ContestFlowPanel({
  panel,
  index,
}: {
  panel: typeof storyPanels[number];
  index: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 0.3, 0.72, 1], reduceMotion ? [0, 0, 0, 0] : [72, 0, 0, -36]);
  const rotate = useTransform(scrollYProgress, [0, 0.34, 0.74, 1], reduceMotion ? [0, 0, 0, 0] : [7, 0, 0, -2]);
  const opacity = useTransform(scrollYProgress, [0, 0.24, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.08, 1, 1, 0.66]);
  const ruleScale = useTransform(scrollYProgress, [0.08, 0.36], reduceMotion ? [1, 1] : [0, 1]);
  const bearY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [26, -34]);
  const bearRotate = useTransform(scrollYProgress, [0, 0.55, 1], reduceMotion ? [0, 0, 0] : [-8, 3, 8]);

  return (
    <section
      ref={ref}
      className="contest-flow__panel"
      data-tone={panel.tone}
      aria-labelledby={`contest-flow-${index}`}
    >
      <div className="page-shell contest-flow__shell">
        <motion.div className="contest-flow__inner" style={{ opacity, rotate, y }}>
          <p className="contest-flow__label">{panel.label}</p>
          <div className="contest-flow__body">
            <motion.div className="contest-flow__rule" style={{ scaleX: ruleScale }} aria-hidden="true" />
            <h2 id={`contest-flow-${index}`} aria-label={panel.title.join(' ')}>
              {panel.title.map((line) => (
                <span key={line} aria-hidden="true">{line}</span>
              ))}
            </h2>
            <ContestAnimatedLine
              line={panel.line}
              reduceMotion={reduceMotion}
              scrollYProgress={scrollYProgress}
            />
            <ul className="contest-flow__facts" aria-label={`${panel.label} details`}>
              {panel.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <motion.div className="contest-flow__bear" style={{ y: bearY, rotate: bearRotate }} aria-hidden="true">
            <Image src="/LAMTBear.png" alt="" width={148} height={148} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ContestStoryClient() {
  return (
    <section className="contest-flow" aria-label="LAMT contest overview">
      {storyPanels.map((panel, index) => (
        <ContestFlowPanel key={panel.label} panel={panel} index={index} />
      ))}
    </section>
  );
}
