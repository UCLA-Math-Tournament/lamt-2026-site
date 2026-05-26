'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const storyText = 'Free in-person contest. Teams up to six. Individual, team, Guts, and awards. UCLA, May 17, 2026.';

const beats = [
  { label: 'Free', value: '$0' },
  { label: 'Teams', value: '6' },
  { label: 'Rounds', value: '5' },
  { label: 'UCLA', value: 'MS' },
];

function RevealWord({
  children,
  progress,
  index,
  total,
  reduceMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  reduceMotion: boolean;
}) {
  const start = Math.max(0, (index - 2) / total);
  const end = Math.min(1, (index + 1.5) / total);
  const opacity = useTransform(progress, [start, end], reduceMotion ? [1, 1] : [0.28, 1]);
  const y = useTransform(progress, [start, end], reduceMotion ? [0, 0] : [2, 0]);

  return (
    <span className="contest-story__word">
      <span aria-hidden="true">{children}</span>
      <motion.span style={{ opacity, y }}>{children}</motion.span>
    </span>
  );
}

function StoryBeat({
  beat,
  index,
  activeBeat,
}: {
  beat: { label: string; value: string };
  index: number;
  activeBeat: MotionValue<number>;
}) {
  const opacity = useTransform(activeBeat, [index - 0.55, index, index + 0.55], [0.34, 1, 0.34]);
  const y = useTransform(activeBeat, [index - 0.55, index, index + 0.55], [8, 0, 8]);

  return (
    <motion.div className="contest-story__beat" style={{ opacity, y }}>
      <span>{beat.label}</span>
      <strong>{beat.value}</strong>
    </motion.div>
  );
}

export default function ContestStoryClient() {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 35%'],
  });
  const activeBeat = useTransform(scrollYProgress, [0, 0.28, 0.56, 0.84], [0, 1, 2, 3]);
  const bearX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const bearRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-7, 4, 8]);
  const words = useMemo(() => storyText.split(' '), []);

  return (
    <section ref={ref} className="page-shell contest-story-section" aria-labelledby="contest-story-title">
      <div className="section-row contest-story-row">
        <h2 id="contest-story-title" className="section-title">Contest</h2>
        <div className="contest-story">
          <p className="contest-story__text">
            {words.map((word, index) => (
              <RevealWord
                key={`${word}-${index}`}
                progress={scrollYProgress}
                index={index}
                total={words.length}
                reduceMotion={reduceMotion}
              >
                {word}
              </RevealWord>
            ))}
          </p>

          <div className="contest-story__stage" aria-hidden="true">
            <motion.div className="contest-story__bear" style={{ x: bearX, rotate: bearRotate }}>
              <Image src="/LAMTBear.png" alt="" width={112} height={112} />
            </motion.div>
            <div className="contest-story__beats">
              {beats.map((beat, index) => (
                <StoryBeat key={beat.label} beat={beat} index={index} activeBeat={activeBeat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
