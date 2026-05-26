'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const REVEAL_SELECTOR = [
  '.page-hero__body',
  '.section-row',
  '.lamt-line-item',
  '.lamt-fact-row',
  '.tournament-format-row',
  '.lamt-agenda-item',
  '.live-schedule-item',
  '.rules-table-row',
  '.rules-key-row',
  '.answer-example-line',
  '.answer-rewrite-row',
  '.faq-row',
  '.archive-round-row',
  '.archive-reference-row',
  '.about-staff-row',
  '.sponsor-heading',
  '.sponsor-grid',
].join(',');

export default function SiteExperienceClient() {
  const pathname = usePathname();
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const bearTop = useTransform(progress, [0, 1], ['0%', '100%']);
  const bearRotate = useTransform(progress, [0, 0.5, 1], [-6, 4, 8]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

    targets.forEach((target, index) => {
      target.dataset.scrollReveal = 'true';
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 34}ms`);
    });

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [pathname, reduceMotion]);

  return (
    <>
      <motion.div className="site-top-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="site-scroll-rail" aria-hidden="true">
        <div className="site-scroll-rail__track">
          <motion.span className="site-scroll-rail__fill" style={{ scaleY: progress }} />
          <motion.span className="site-scroll-rail__bear" style={{ top: bearTop, rotate: bearRotate }}>
            <Image src="/LAMTBear.png" alt="" width={44} height={44} />
          </motion.span>
        </div>
      </div>
    </>
  );
}
