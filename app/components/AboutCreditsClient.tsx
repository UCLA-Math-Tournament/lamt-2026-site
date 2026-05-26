'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type StaffGroup = {
  title: string;
  people: string[];
};

function NameRiver({
  names,
  direction = 1,
  compact = false,
}: {
  names: string[];
  direction?: 1 | -1;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : direction === 1 ? ['-1.6%', '1.6%'] : ['1.6%', '-1.6%'],
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : direction === 1 ? [-0.45, 0, 0.45] : [0.45, 0, -0.45],
  );

  return (
    <div ref={ref} className={compact ? 'about-river about-river--compact' : 'about-river'}>
      <motion.p style={{ x, rotate }}>
        {names.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </motion.p>
    </div>
  );
}

export default function AboutCreditsClient({
  staffGroups,
  contributors,
  advisors,
}: {
  staffGroups: StaffGroup[];
  contributors: string[];
  advisors: string[];
}) {
  return (
    <>
      <section className="section-row">
        <h2 className="section-title">Staff</h2>
        <div className="about-credits">
          {staffGroups.map((group, index) => (
            <section key={group.title} className="about-credit-row" data-tone={index % 2 === 0 ? 'blue' : 'gold'}>
              <div className="about-credit-row__heading">
                <h3>{group.title}</h3>
              </div>
              <NameRiver names={group.people} direction={index % 2 === 0 ? 1 : -1} />
            </section>
          ))}
          <div className="about-credits__bear" aria-hidden="true">
            <Image src="/LAMTBear.png" alt="" width={132} height={132} />
          </div>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Contributors</h2>
        <NameRiver names={contributors} compact />
      </section>

      <section className="section-row">
        <h2 className="section-title">Advisors</h2>
        <NameRiver names={advisors} direction={-1} compact />
      </section>
    </>
  );
}
