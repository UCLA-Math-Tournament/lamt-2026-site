'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

const phrases = ['LAMT', 'UCLA', 'May 17', 'Free', 'Teams up to six', 'Guts', 'Awards'];
const repeatedPhrases = Array.from({ length: 4 }, () => phrases).flat();

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export default function KineticTournamentBandClient() {
  const reduceMotion = Boolean(useReducedMotion());
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 54,
    stiffness: 360,
  });
  const velocityFactor = useTransform(smoothVelocity, [-900, 900], [-1.6, 1.6], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;

    const latestVelocity = velocityFactor.get();
    directionFactor.current = latestVelocity < 0 ? -1 : 1;

    const baseMove = directionFactor.current * 7.5 * (delta / 1000);
    const velocityMove = directionFactor.current * Math.abs(baseMove) * latestVelocity;
    baseX.set(baseX.get() + baseMove + velocityMove);
  });

  return (
    <section
      className="kinetic-band"
      aria-label="LAMT is a free UCLA math contest on May 17 with team, Guts, and awards rounds."
    >
      <div className="kinetic-band__rule" aria-hidden="true" />
      <div className="kinetic-band__viewport" aria-hidden="true">
        <motion.div className="kinetic-band__track" style={{ x: reduceMotion ? '0%' : x }}>
          {repeatedPhrases.map((phrase, index) => (
            <span className="kinetic-band__item" key={`${phrase}-${index}`}>
              {index % phrases.length === 0 ? (
                <Image src="/LAMTBear.png" alt="" width={54} height={54} />
              ) : null}
              <span>{phrase}</span>
            </span>
          ))}
        </motion.div>
      </div>
      <div className="kinetic-band__rule kinetic-band__rule--blue" aria-hidden="true" />
    </section>
  );
}
