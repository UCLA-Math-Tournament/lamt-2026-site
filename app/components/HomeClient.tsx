'use client';

import Link from 'next/link';
import { ArrowRightIcon, FileTextIcon } from '@radix-ui/react-icons';
import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';

const homeButtonClass =
  'hero-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold uppercase text-white';

const heroTitle = 'Los Angeles Math Tournament';
const titleWords = heroTitle.split(' ');

function FloatingPaths({
  position,
  tone,
  reducedMotion,
}: {
  position: 1 | -1;
  tone: 'blue' | 'gold';
  reducedMotion: boolean;
}) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${
      312 - i * 5 * position
    } ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${
      470 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    opacity: 0.08 + i * 0.015,
    width: 0.55 + i * 0.028,
    duration: 18 + (i % 9),
    delay: i * 0.03,
  }));

  return (
    <div className={`home-hero__motion-set home-hero__motion-set--${tone}`}>
      <svg viewBox="0 0 696 316" fill="none" role="presentation" focusable="false">
        {paths.map((path) => (
          <motion.path
            key={`${tone}-${path.id}`}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={reducedMotion ? false : { pathLength: 1, opacity: path.opacity * 0.7 }}
            animate={
              reducedMotion
                ? { pathLength: 1, opacity: path.opacity }
                : {
                    pathLength: 1,
                    opacity: [path.opacity * 0.55, path.opacity, path.opacity * 0.55],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: path.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                    delay: path.delay,
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

function AnimatedHeroTitle({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <h1 aria-label={heroTitle}>
      {titleWords.map((word, wordIndex) => (
        <Fragment key={word}>
          <span className="home-title-word" aria-hidden="true">
            {word.split('').map((letter, letterIndex) => (
              <motion.span
                key={`${word}-${letterIndex}`}
                className="home-title-letter"
                initial={reducedMotion ? false : { y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        delay: wordIndex * 0.07 + letterIndex * 0.014,
                        type: 'spring',
                        stiffness: 160,
                        damping: 26,
                      }
                }
              >
                {letter}
              </motion.span>
            ))}
          </span>
          {wordIndex < titleWords.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h1>
  );
}

export default function HomeClient() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section className="home-hero">
      <div className="home-hero__motion" aria-hidden="true">
        <FloatingPaths position={1} tone="blue" reducedMotion={reducedMotion} />
        <FloatingPaths position={-1} tone="gold" reducedMotion={reducedMotion} />
      </div>

      <div className="home-hero__content">
        <p className="home-hero__meta">May 17, 2026. UCLA.</p>
        <AnimatedHeroTitle reducedMotion={reducedMotion} />
        <p className="cinema-lede">
          Free in-person math contest for middle and high school students.
        </p>

        <div className="cinema-actions">
          <Link href="/tournament" className={homeButtonClass}>
            Tournament <ArrowRightIcon />
          </Link>
          <Link href="/archive" className={`${homeButtonClass} hero-button--ghost`}>
            <FileTextIcon /> 2026 Archive
          </Link>
        </div>
      </div>
    </section>
  );
}
